
## ⚙️ GitHub Actions Pipeline Flow for Uptimeflare

```text
 Developer Push (main branch)
                │
                ▼
      ┌─────────────────────┐
      │ GitHub Actions Job  │
      │  build-and-deploy   │
      └─────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │  Checkout + Setup         │
 │  - actions/checkout       │
 │  - setup-terraform        │
 │  - setup-node             │
 └───────────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │  Cloudflare Setup         │
 │  - Fetch Account ID       │
 │  - Dummy Worker (subdomain)│
 │  - Install packages       │
 └───────────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │  Build Phase              │
 │  - Build Worker (wrangler)│
 │  - Build Pages (Next.js)  │
 └───────────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │  Terraform Deploy         │
 │  - terraform init (TFC)   │
 │  - terraform apply        │
 │  Resources:               │
 │   * KV Namespace          │
 │   * Worker Script         │
 │   * Cron Trigger          │
 │   * Pages Project (config)│
 └───────────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │ Manual API Patches        │
 │  - Durable Object binding │
 │  - Enable logs            │
 └───────────────────────────┘
                │
                ▼
 ┌───────────────────────────┐
 │  Final Deploy             │
 │  - wrangler pages deploy  │
 │  (upload static site)     │
 └───────────────────────────┘
                │
                ▼
        ✅ Cloudflare Infra Ready
        Pages + Worker + KV + DO + Cron
```

---

## 🔎 Step Highlights

* **Terraform Cloud**: Stores state remotely (no imports each run).
* **Wrangler**: Used for Pages uploads (since TF provider can’t).
* **API Patches**: Handle Durable Objects & logging (provider gap workaround).
* **KV + Cron**: Managed cleanly by Terraform provider.
* **Subdomain fix**: Dummy Worker ensures new accounts have a Workers subdomain allocated.

---

## ✅ End-to-End Flow

1. You push to `main`.
2. GitHub Actions builds Worker + Pages.
3. Terraform Cloud provisions infra (KV, Worker shell, Cron, Pages project).
4. API calls patch in Durable Objects + enable logs.
5. Wrangler CLI uploads static assets to Pages.
6. Deployment is live across Cloudflare’s edge.

