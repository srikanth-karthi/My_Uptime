terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }

  backend "remote" {
    organization = "srikanth-dev"

    workspaces {
      name = "uptimeflare"
    }
  }
}

provider "cloudflare" {
  api_token = var.CLOUDFLARE_API_TOKEN
}

# -------------------- VARIABLES --------------------

variable "CLOUDFLARE_API_TOKEN" {
  type      = string
  sensitive = true
}

variable "CLOUDFLARE_ACCOUNT_ID" {
  type = string
}

variable "CLOUDFLARE_ZONE_ID" {
  type        = string
  description = "Zone ID for srikanthkarthi.tech"
}

variable "CLOUDFLARE_PAGES_PROJECT_NAME" {
  type        = string
  default     = "uptimeflare"
}

# -------------------- WORKERS KV --------------------

resource "cloudflare_workers_kv_namespace" "uptimeflare_kv" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  title      = "uptimeflare_kv"
}

# -------------------- WORKER SCRIPT --------------------

resource "cloudflare_workers_script" "uptimeflare" {
  account_id         = var.CLOUDFLARE_ACCOUNT_ID
  name               = "uptimeflare_worker"
  content            = file("worker/dist/index.js")
  module             = true
  compatibility_date = "2025-04-02"

  kv_namespace_binding {
    name         = "UPTIMEFLARE_STATE"
    namespace_id = cloudflare_workers_kv_namespace.uptimeflare_kv.id
  }
}

# -------------------- CRON TRIGGER --------------------

resource "cloudflare_workers_cron_trigger" "uptimeflare_worker_cron" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  script_name = cloudflare_workers_script.uptimeflare.name

  schedules = [
    "0 */1 * * *" # every 1 hour
  ]
}

# -------------------- CREATE PAGES PROJECT --------------------

resource "cloudflare_pages_project" "uptimeflare" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name       = var.CLOUDFLARE_PAGES_PROJECT_NAME

  production_branch = "main"

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
  }

  deployment_configs {
    production {
      compatibility_date = "2025-04-02"
    }
  }
}

# -------------------- CUSTOM DOMAIN FOR STATUS PAGE --------------------

resource "cloudflare_pages_domain" "status_domain" {
  account_id   = var.CLOUDFLARE_ACCOUNT_ID
  project_name = cloudflare_pages_project.uptimeflare.name
  domain       = "status.srikanthkarthi.tech"
}

# -------------------- DNS RECORD --------------------

resource "cloudflare_record" "status_cname" {
  zone_id = var.CLOUDFLARE_ZONE_ID
  name    = "status"

  value = "${cloudflare_pages_project.uptimeflare.subdomain}.pages.dev"

  type    = "CNAME"
  ttl     = 1
  proxied = true
}
