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
  type = string
}

variable "PAGES_PROJECT_NAME" {
  type    = string
  default = "uptimeflare"
}

###############################
# Workers KV Namespace
###############################

resource "cloudflare_workers_kv_namespace" "uptimeflare_kv" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  title      = "uptimeflare_kv"
}

###############################
# Worker Script
###############################

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

###############################
# Worker Cron Trigger
###############################

resource "cloudflare_workers_cron_trigger" "uptimeflare_worker_cron" {
  account_id  = var.CLOUDFLARE_ACCOUNT_ID
  script_name = cloudflare_workers_script.uptimeflare.name

  schedules = [
    "0 */1 * * *"
  ]
}

###############################
# CREATE Cloudflare Pages Project
###############################

resource "cloudflare_pages_project" "uptimeflare" {
  account_id = var.CLOUDFLARE_ACCOUNT_ID
  name       = var.PAGES_PROJECT_NAME

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

###############################
# Add Custom Domain for Pages
###############################

resource "cloudflare_pages_domain" "status_domain" {
  account_id   = var.CLOUDFLARE_ACCOUNT_ID
  project_name = cloudflare_pages_project.uptimeflare.name
  domain       = "status.srikanthkarthi.tech"
}
