# Trellis

See what is holding everything up.

Interactive website plus a standalone, dependency-free Node.js API in `engine/`.

# Trellis API

Download, unzip, run. Node.js 22+, no dependencies.

```sh
node server.mjs
curl http://127.0.0.1:8787/health
npm test
```

POST JSON to `/v1/plan`. See `openapi.json`. The server accepts up to 5 MiB per request, holds the request body in memory, and stores nothing on disk. Bind address defaults to loopback. Configure `HOST` and `PORT` as needed. Public deployments need your own TLS, authentication, rate limits, and process supervision. Dockerfile included.

Example: `{"tasks":[{"id":"A","duration":3,"dependsOn":[]},{"id":"B","duration":2,"dependsOn":["A"]}]}`. Duration is 5. Cycle inputs return HTTP 200 with `feasible:false` and a directed cycle witness. Invalid IDs, unknown dependencies, and invalid durations return 400. O(V+E) scheduling, up to 50,000 tasks and 200,000 edges. Scheduling assumes unlimited parallel capacity and one consistent duration unit; no worker allocation, calendars, or optimal resource-constrained scheduling is claimed. The `impact` export returns downstream tasks reachable from a selected task.

MIT license. Created by Rishit Pradhan with AI-assisted implementation.

The website runs analysis locally in a browser Web Worker. The optional hosted POST endpoint is `/api/plan`; the standalone server uses `/v1/plan`. Hosted Sites access follows the owner’s Sites sharing settings.

Website: `npm install`, `npm run dev`, `npm run build`. Engine: `node --test engine/test.mjs`.

## Verification and scale

A local engine check scheduled 50,000 tasks with 199,990 dependency edges.
Exact measurements and environment are in `evidence/benchmark.json`. These are single-process local checks, not production concurrency or latency guarantees. HTTP endpoint and extracted-download tests are in `evidence/http-verification.json`. Visual browser automation was unavailable because the executor rejected a symlinked workspace root.

Rebuild the downloadable bundle with `python3 scripts/package-api.py` after changing engine files, then build the website.
