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

variable "CLOUDFLARE_API_TOKEN" {
  type      = string
  sensitive = true
}
variable "CLOUDFLARE_ACCOUNT_ID" {
  # read account id from $TF_VAR_CLOUDFLARE_ACCOUNT_ID
  type = string
}

variable "CLOUDFLARE_ZONE_ID" {
  # read zone id from $TF_VAR_CLOUDFLARE_ZONE_ID
  type        = string
  description = "Zone ID for srikanthkarthi.tech domain"
}

resource "cloudflare_workers_kv_namespace" "uptimeflare_kv" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  title      = "uptimeflare_kv"
}

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

resource "cloudflare_worker_cron_trigger" "uptimeflare_worker_cron" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  script_name = cloudflare_workers_script.uptimeflare.name
  schedules = [
    "0 */1 * * *", # every 1 hour
  ]
}


resource "cloudflare_pages_project" "uptimeflare" {
  account_id        = var.CLOUDFLARE_ACCOUNT_ID
  name              = "uptimeflare"
  production_branch = "main"

  deployment_configs {
    production {
      kv_namespaces = {
        UPTIMEFLARE_STATE = cloudflare_workers_kv_namespace.uptimeflare_kv.id
      }
      compatibility_date  = "2025-04-02"
      compatibility_flags = ["nodejs_compat"]
    }
  }
}

# Custom domain for status page
resource "cloudflare_pages_domain" "status_domain" {
  account_id   = var.CLOUDFLARE_ACCOUNT_ID
  project_name = cloudflare_pages_project.uptimeflare.name
  domain       = "status.srikanthkarthi.tech"
}

# DNS record for custom domain
resource "cloudflare_record" "status_cname" {
  zone_id = var.CLOUDFLARE_ZONE_ID
  name    = "status"
  value   = cloudflare_pages_project.uptimeflare.subdomain
  type    = "CNAME"
  ttl     = 1
  proxied = true
  comment = "Custom domain for Uptimeflare status page"
}
