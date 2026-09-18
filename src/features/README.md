# features/

One folder per domain feature. Pages in `src/app` import features only through their `index.ts`.

```
features/<feature>/
├── components/     UI used only by this feature
├── data/           static typed data (today's "backend")
├── services/       async functions — the only way to read this feature's data
├── types.ts
└── index.ts        public API
```

```ts
// features/projects/services/get-projects.ts
import { projects } from "../data/projects";
import type { Project } from "../types";

export async function getProjects(): Promise<Project[]> {
  return projects; // later: return api.get<Project[]>("/projects");
}
```

Full rules: `docs/ARCHITECTURE.md`.
