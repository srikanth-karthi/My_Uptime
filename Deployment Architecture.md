
## 🌐 Cloudflare Deployment Architecture (Uptimeflare)

```text
                 ┌───────────────────┐
                 │   Cloudflare Pages │
                 │  (uptimeflare app) │
                 │  Static frontend   │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │  Cloudflare Worker │
                 │  uptimeflare_worker│
                 │  (JS/TS logic)     │
                 └─────────┬─────────┘
                           │
      ┌────────────────────┼──────────────────────┐
      ▼                    ▼                      ▼
┌──────────────┐   ┌──────────────────┐   ┌───────────────────────┐
│ KV Namespace │   │ Durable Object   │   │ Cron Trigger (every 1m)│
│ uptimeflare_ │   │ RemoteChecker_DO │   │ Schedules worker calls │
│ kv (state)   │   │ (class RemoteChk)│   └───────────────────────┘
└──────────────┘   └──────────────────┘
```

---

## 🔎 How It Works Together

1. **Cloudflare Pages**

   * Hosts your static Next.js frontend (`.vercel/output/static`).
   * Deployed using `wrangler pages deploy`.
   * User requests (browser) hit Pages first.

2. **Cloudflare Worker (`uptimeflare_worker`)**

   * Acts as backend logic.
   * Bound to **KV** and **Durable Objects**.
   * Handles API requests, background checks, etc.

3. **KV Namespace (`uptimeflare_kv`)**

   * Stores global key-value state.
   * Example: cached uptime check results, config.
   * Bound to Worker as `UPTIMEFLARE_STATE`.

4. **Durable Object (`RemoteChecker_DO`)**

   * Provides **per-instance coordination**.
   * Example: ensures only one check per site at a time, manages locks.
   * Bound manually (since Terraform provider doesn’t support it yet).

5. **Worker Cron Trigger**

   * Runs the Worker every minute (`* * * * *`).
   * Used for scheduled background checks (e.g., uptime probes).

---

## 🛠 Why the Workarounds?

* **Durable Objects**: not supported in provider v4 (and buggy in v5) → added manually with `curl` PATCH.
* **Pages upload**: Terraform provider can define the project, but can’t upload builds → deployed with Wrangler CLI.

---

✅ **Big Picture**:

* Pages = frontend
* Worker = backend logic
* KV = global state store
* DO = stateful logic / coordination
* Cron = background scheduler

