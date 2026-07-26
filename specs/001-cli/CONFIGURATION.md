---
id: GEN-SPEC-001-CONFIG
title: Genesis Configuration System
status: Approved
version: 1.0.0
owner: Project Genesis
phase: 1
package: "@genesis/core"
implements: GEN-SPEC-001
audience: developers, plugin authors, AI assistants
---

# Genesis Configuration System

## Purpose

Define the complete **configuration system** for Project Genesis — how settings are declared, merged, validated, overridden, and consumed by the CLI, scaffolding engine, plugins, and AI engine.

The canonical project configuration file is **`genesis.config.ts`** at the project root. It provides type-safe, IDE-autocomplete-friendly configuration comparable to `vite.config.ts`, `next.config.ts`, or `angular.json` — but unified across game, backend, Unity, deployment, and AI concerns.

Behavioral loading rules live in [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md). Command surface lives in [COMMAND_REFERENCE.md](COMMAND_REFERENCE.md).

## Scope

### In Scope

- `genesis.config.ts` schema and API
- Global user configuration (`~/.genesis/`)
- Plugin configuration blocks
- AI provider configuration
- Template resolution and overrides
- Output directory conventions
- Unity and backend configuration sections
- Deployment environment configuration
- Secrets management and environment overrides
- Validation rules and error codes
- Migration from legacy YAML config

### Out of Scope

- Runtime implementation code
- Generated game `ScriptableObject` values (Unity runtime config)
- LiveOps remote config (see [009-liveops](../009-liveops/))
- Third-party credential provisioning (Firebase console, AWS IAM)

---

## Configuration Architecture

### File Hierarchy

```mermaid
flowchart TB
    subgraph global [Global — User Machine]
        GC[~/.genesis/config.ts]
        GE[~/.genesis/.env]
    end

    subgraph project [Project Root]
        PC[genesis.config.ts]
        ENV[.env]
        ENVEX[.env.example]
        DOTGENESIS[.genesis/]
    end

    subgraph runtime [Runtime Metadata — .genesis/]
        META[metadata.json]
        REPORT[generation-report.json]
        LOCK[config.lock.json]
        LOCAL[local.config.ts]
    end

    subgraph overrides [Invocation]
        CLI[CLI flags]
        ENVVARS[GENESIS_* env vars]
    end

    GC --> MERGE[Config Merger]
    GE --> MERGE
    PC --> MERGE
    DOTGENESIS --> MERGE
    ENV --> MERGE
    ENVVARS --> MERGE
    CLI --> MERGE
    MERGE --> RESOLVED[ResolvedConfiguration]
```

### Configuration Files

| File | Scope | Committed | Purpose |
|------|-------|-----------|---------|
| `genesis.config.ts` | Project | yes | **Canonical** project configuration |
| `.genesis/local.config.ts` | Project | no | Developer-local overrides (gitignored) |
| `.genesis/metadata.json` | Project | yes | Genesis-managed metadata (version, template, timestamps) |
| `.genesis/config.lock.json` | Project | yes | Locked resolved config hash for reproducibility |
| `~/.genesis/config.ts` | Global | n/a | User defaults (author, AI preferences) |
| `~/.genesis/.env` | Global | n/a | User-level secrets (API keys) |
| `.env` | Project | no | Project secrets |
| `.env.example` | Project | yes | Documented env var template |
| `.env.{environment}` | Project | no | Environment-specific secrets (`.env.staging`) |

### Legacy YAML (Deprecated)

Earlier specifications referenced `.genesis/config.yml` and `genesis.config.yml`. These are **deprecated** in favor of `genesis.config.ts`.

| Legacy File | Replacement | Migration |
|-------------|-------------|-----------|
| `.genesis/config.yml` | `genesis.config.ts` | `genesis migrate config` |
| `genesis.config.yml` | `genesis.config.ts` | `genesis migrate config` |
| `genesis.unity.config.yml` | `genesis.config.ts` → `unity` section | Auto-merged by migrator |

During migration period (v0.1–v0.2), Genesis loads YAML if `genesis.config.ts` is absent and emits a deprecation warning.

---

## Merge Precedence

Configuration values resolve from lowest to highest priority. Higher layers override lower layers.

```mermaid
flowchart BT
    L1[1. Built-in defaults] --> L2[2. Global config ~/.genesis/config.ts]
    L2 --> L3[3. Project genesis.config.ts]
    L3 --> L4[4. .genesis/local.config.ts]
    L4 --> L5[5. Environment files .env / .env.local]
    L5 --> L6[6. GENESIS_* environment variables]
    L6 --> L7[7. CLI flags]
```

| Priority | Source | Example |
|----------|--------|---------|
| 1 | Built-in defaults | `logLevel: "info"` |
| 2 | `~/.genesis/config.ts` | `author: "Alex Chen"` |
| 3 | `genesis.config.ts` | `project.name: "ocean-quest"` |
| 4 | `.genesis/local.config.ts` | `backend.port: 3001` |
| 5 | `.env`, `.env.local`, `.env.{env}` | `DATABASE_URL=...` |
| 6 | `GENESIS_*` variables | `GENESIS_LOG_LEVEL=debug` |
| 7 | CLI flags | `--verbose`, `--template mobile-puzzle` |

### Secret Resolution

Secrets are **never** stored in `genesis.config.ts`. They resolve from environment at runtime:

```typescript
// genesis.config.ts — references env vars, not values
backend: {
  database: {
    url: process.env.DATABASE_URL,  // resolved at load time
  },
},
```

---

## `genesis.config.ts` API

###`defineConfig` Helper

Following the Vite/Next.js pattern, projects export a typed configuration:

```typescript
import { defineConfig } from '@genesis/config';

export default defineConfig({
  // configuration
});
```

| Export | Supported | Description |
|--------|-----------|-------------|
| `export default defineConfig({...})` | yes | Static configuration object |
| `export default defineConfig(async () => ({...}))` | yes | Async configuration (read files, env) |
| `export default defineConfig(({ mode, env }) => ({...}))` | yes | Mode-aware (development, staging, production) |
| Named export `config` | no | Use default export only |

### Type Package

Types ship from `@genesis/config` (re-exported by `@genesis/shared`):

```typescript
import type { GenesisConfig, GenesisConfigExport } from '@genesis/config';
```

IDE autocomplete and `genesis config validate` use the same schema.

---

## Configuration Schema

### Top-Level Structure

```typescript
interface GenesisConfig {
  /** Config schema version. Current: 1 */
  $schema?: string;

  /** Project identity and metadata */
  project: ProjectConfig;

  /** Scaffolding and generation defaults */
  generation: GenerationConfig;

  /** Template resolution */
  templates: TemplatesConfig;

  /** Output directory conventions */
  output: OutputConfig;

  /** Backend (NestJS, Express, Fastify) */
  backend?: BackendConfig;

  /** Unity client */
  unity?: UnityConfig;

  /** Game-specific settings (when project.type === 'game') */
  game?: GameConfig;

  /** Plugin configuration blocks */
  plugins?: PluginsConfig;

  /** AI engine and providers */
  ai?: AIConfig;

  /** Build and deployment */
  deploy?: DeployConfig;

  /** CLI and logging preferences (project-level overrides) */
  cli?: CLIConfig;
}
```

---

## Global Configuration

**Location:** `~/.genesis/config.ts`

User-level defaults applied to every Genesis project on the machine unless overridden.

```typescript
// ~/.genesis/config.ts
import { defineGlobalConfig } from '@genesis/config';

export default defineGlobalConfig({
  user: {
    name: 'Alex Chen',
    email: 'alex@studio.example.com',
  },

  defaults: {
    author: 'Alex Chen',
    license: 'MIT',
    template: 'default',
  },

  cli: {
    color: true,
    logLevel: 'info',
  },

  ai: {
    defaultProvider: 'openai',
    enrichOnCreate: true,
  },

  plugins: {
    autoUpdate: false,
    registry: 'https://registry.project-genesis.dev',
  },
});
```

### Global Schema

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `user.name` | string | — | Display name for generation |
| `user.email` | string | — | Email for git commits, copyright |
| `defaults.author` | string | — | Default `author` in projects |
| `defaults.license` | string | `MIT` | Default SPDX license |
| `defaults.template` | string | `default` | Default project template |
| `cli.color` | boolean | `true` | ANSI colors |
| `cli.logLevel` | enum | `info` | `debug`, `info`, `warn`, `error` |
| `ai.defaultProvider` | string | `openai` | Default AI provider ID |
| `ai.enrichOnCreate` | boolean | `true` | AI enrichment on `create` |
| `plugins.registry` | string | genesis default | Plugin registry URL |
| `plugins.autoUpdate` | boolean | `false` | Check for plugin updates on start |

### Global Commands

```bash
genesis config init --global          # Create ~/.genesis/config.ts
genesis config show --global          # Show resolved global config
genesis config edit --global          # Open in $EDITOR
```

---

## Project Configuration

**Location:** `{projectRoot}/genesis.config.ts`

The primary configuration file. Created automatically by `genesis create` and `genesis create game`.

### Minimal Project Config

```typescript
// genesis.config.ts
import { defineConfig } from '@genesis/config';

export default defineConfig({
  project: {
    name: 'ocean-quest',
    type: 'game',           // 'game' | 'backend' | 'generic'
    template: 'mobile-puzzle',
    version: '0.1.0',
  },

  generation: {
    overwritePolicy: 'skip',  // 'skip' | 'prompt' | 'force'
    validateAfterGenerate: true,
  },

  output: {
    root: '.',
  },
});
```

### Project Schema

| Key | Type | Required | Description |
|-----|------|----------|-------------|
| `project.name` | string | yes | Project identifier (kebab-case) |
| `project.type` | enum | yes | `game`, `backend`, `generic` |
| `project.template` | string | yes | Template used at creation |
| `project.version` | string | yes | Semver project version |
| `project.genre` | string | game only | `rpg`, `puzzle`, `idle`, etc. |
| `project.description` | string | no | Short description |
| `project.author` | string | no | Overrides global default |
| `project.license` | string | no | SPDX license identifier |
| `project.createdAt` | string | auto | ISO 8601 timestamp (Genesis-managed) |
| `project.genesisVersion` | string | auto | Genesis CLI version at creation |

### Mode-Aware Configuration

```typescript
import { defineConfig } from '@genesis/config';

export default defineConfig(({ mode }) => ({
  project: {
    name: 'ocean-quest',
    type: 'game',
    template: 'mobile-puzzle',
    version: '0.1.0',
  },

  backend: {
    port: mode === 'production' ? 8080 : 3000,
    cors: {
      origin: mode === 'production'
        ? ['https://ocean-quest.example.com']
        : ['http://localhost:*'],
    },
  },

  deploy: {
    environments: {
      [mode]: {
        apiUrl: mode === 'production'
          ? 'https://api.ocean-quest.example.com'
          : 'http://localhost:3000',
      },
    },
  },
}));
```

**Mode resolution:** `development` (default) | `staging` | `production` | `test`

Set via: `GENESIS_MODE`, `--mode`, or `NODE_ENV`.

---

## Generation Configuration

Controls scaffolding behavior for `genesis create` and `genesis generate`.

```typescript
generation: {
  overwritePolicy: 'skip',       // 'skip' | 'prompt' | 'force'
  validateAfterGenerate: true,
  continueOnError: false,        // multi-phase: continue if phase fails
  interactive: 'auto',           // 'auto' | 'always' | 'never'
  dryRun: false,

  variables: {
    author: 'Studio Alpha',
    company: 'Studio Alpha Inc.',
  },

  hooks: {
    preGenerate: ['./scripts/pre-generate.ts'],
    postGenerate: ['./scripts/post-generate.ts'],
  },
},
```

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `overwritePolicy` | enum | `skip` | File conflict behavior |
| `validateAfterGenerate` | boolean | `true` | Run validator after generation |
| `continueOnError` | boolean | `false` | Continue multi-phase on phase failure |
| `interactive` | enum | `auto` | Prompt behavior |
| `variables` | object | `{}` | Default template variables |
| `hooks.preGenerate` | string[] | `[]` | Scripts before generation |
| `hooks.postGenerate` | string[] | `[]` | Scripts after generation |

Variables are available in templates as `{{config.generation.variables.author}}`.

---

## Template Configuration

Controls which templates are used and where they are discovered.

```typescript
templates: {
  /** Primary template set (from project creation) */
  project: 'mobile-puzzle',

  /** Additional template search paths */
  paths: [
    './templates',                    // project-local
    '~/.genesis/templates',           // user-global
  ],

  /** Override specific generator templates */
  overrides: {
    'api': './templates/custom-api',
    'unity-system': '@genesis/plugin-unity/templates/system',
  },

  /** Pin template versions */
  versions: {
    'mobile-puzzle': '1.2.0',
  },

  /** Template variables injected into all renders */
  variables: {
    company: 'Studio Alpha',
    supportEmail: 'support@studio.example.com',
  },
},
```

### Template Discovery Order

| Priority | Path | Source |
|----------|------|--------|
| 1 | `templates.overrides.{generatorId}` | Explicit override in config |
| 2 | `./templates/` | Project-local |
| 3 | `.genesis/templates/` | Genesis-managed project templates |
| 4 | `~/.genesis/templates/` | User-global |
| 5 | `@genesis/scaffolding/templates/` | Built-in |
| 6 | Plugin `templates/` directories | Plugin-contributed |

### Template Commands

```bash
genesis config show templates
genesis config validate --section templates
```

---

## Output Configuration

Defines where generated artifacts are written.

```typescript
output: {
  /** Project root (usually '.') */
  root: '.',

  /** Per-domain output directories */
  dirs: {
    backend: './backend',
    unity: './unity',
    docs: './docs',
    tests: './tests',
    generated: './.genesis/generated',  // ephemeral codegen cache
    reports: './.genesis/reports',
    analysis: './.genesis/analysis',
  },

  /** Clean patterns for genesis maintain clean */
  clean: [
    '**/dist',
    '**/build',
    '**/.turbo',
    './.genesis/generated',
  ],
},
```

### Default Output Layout (Game Project)

| Key | Default Path | Contents |
|-----|--------------|----------|
| `output.dirs.backend` | `./backend` | NestJS API |
| `output.dirs.unity` | `./unity` | Unity project |
| `output.dirs.docs` | `./docs` | GDD, architecture, API docs |
| `output.dirs.generated` | `./.genesis/generated` | Codegen cache (gitignored) |
| `output.dirs.reports` | `./.genesis/reports` | Validation, analysis reports |

### Output Rules

| Rule | Description |
|------|-------------|
| O1 | All paths relative to `output.root` |
| O2 | Genesis never writes outside `output.root` without `--force` |
| O3 | `output.dirs.*` can be customized; generators respect config |
| O4 | Changing output dirs after creation requires `genesis migrate config` |

---

## Backend Configuration

```typescript
backend: {
  framework: 'nestjs',           // 'nestjs' | 'express' | 'fastify'
  language: 'typescript',
  port: 3000,
  host: '0.0.0.0',
  apiPrefix: '/api/v1',

  architecture: {
    pattern: 'ddd',              // 'ddd' | 'vertical-slice'
    cqrs: false,
    eventDriven: false,
  },

  database: {
    type: 'postgres',            // 'postgres' | 'mongodb' | 'sqlite'
    url: process.env.DATABASE_URL,
    orm: 'typeorm',              // 'typeorm' | 'prisma' | 'mongoose'
    migrations: {
      path: './backend/src/infrastructure/database/migrations',
      runOnStart: false,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  cache: {
    enabled: true,
    type: 'redis',
    url: process.env.REDIS_URL,
    ttl: 3600,
  },

  auth: {
    enabled: true,
    strategy: 'jwt',               // 'jwt' | 'session' | 'api-key'
    jwtSecret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },

  cors: {
    enabled: true,
    origin: ['http://localhost:*'],
  },

  observability: {
    healthCheck: true,
    metrics: true,
    swagger: true,
    swaggerPath: '/api/docs',
  },

  docker: {
    enabled: true,
    services: ['postgres', 'redis'],
    composeFile: './backend/docker-compose.yml',
  },
},
```

### Backend Schema Summary

| Section | Key Fields | Env Vars |
|---------|------------|----------|
| `framework` | `nestjs`, `express`, `fastify` | — |
| `database` | `type`, `url`, `orm` | `DATABASE_URL` |
| `cache` | `type`, `url`, `ttl` | `REDIS_URL` |
| `auth` | `strategy`, `jwtSecret` | `JWT_SECRET` |
| `docker` | `services[]` | — |

### Backend Config Consumption

| Consumer | Uses |
|----------|------|
| `genesis generate backend *` | Framework, architecture pattern |
| `genesis backend run` | `port`, `host` |
| `genesis backend migrate` | `database.migrations` |
| `genesis deploy` | `docker`, environment URLs |
| Generated `backend/src/config/` | Runtime NestJS config module |

---

## Unity Configuration

```typescript
unity: {
  version: '6000.0',               // Unity 6 LTS
  renderPipeline: 'urp',           // 'urp' | 'hdrp' | 'builtin'
  dimension: '2d',                 // '2d' | '3d'
  targetPlatforms: ['ios', 'android'],

  project: {
    companyName: 'Studio Alpha',
    productName: 'Ocean Quest',
    bundleId: 'com.studioalpha.oceanquest',
    version: '0.1.0',
    buildNumber: 1,
  },

  performance: {
    targetFps: 60,
    vSync: true,
    scriptableRenderPipeline: true,
  },

  input: {
    system: 'new',                 // 'new' | 'legacy'
    actionAsset: './unity/Assets/_Project/Settings/Input/GameInput.inputactions',
  },

  addressables: {
    enabled: true,
    buildPath: './unity/Assets/AddressableAssetsData',
    remoteCatalog: false,
  },

  localization: {
    enabled: true,
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
  },

  services: {
    analytics: {
      provider: 'firebase',          // 'firebase' | 'ugs' | 'none'
      configFile: process.env.FIREBASE_CONFIG_PATH,
    },
    ads: {
      enabled: true,
      provider: 'admob',             // 'admob' | 'ironsource' | 'none'
      testMode: true,
    },
    iap: {
      enabled: true,
      testMode: true,
    },
    cloudSave: {
      provider: 'firebase',          // 'firebase' | 'backend' | 'none'
    },
  },

  build: {
    il2cpp: true,
    scriptingBackend: 'IL2CPP',
    outputPath: './unity/Builds',
    android: {
      minSdk: 24,
      targetSdk: 34,
      buildAppBundle: true,
    },
    ios: {
      minVersion: '14.0',
      targetDevice: 'iphone',
    },
  },
},
```

### Unity Schema Summary

| Section | Purpose |
|---------|---------|
| `version` | Unity Editor version |
| `renderPipeline` | URP/HDRP/built-in |
| `dimension` | 2D vs 3D project setup |
| `project` | Company, bundle ID, version |
| `performance` | FPS, vSync targets |
| `addressables` | Asset management |
| `localization` | Locale configuration |
| `services` | Analytics, ads, IAP, cloud save |
| `build` | Platform build settings |

### Unity Config Consumption

| Consumer | Uses |
|----------|------|
| `genesis generate unity-*` | `dimension`, `renderPipeline` |
| `genesis game run unity` | Project path from `output.dirs.unity` |
| `genesis deploy build unity` | `build.*`, `targetPlatforms` |
| Generated `GameConfig.asset` | Runtime ScriptableObject (derived from config) |

### Relationship to Unity Player Settings

`genesis.config.ts` is the **source of truth** for Genesis tooling. On `genesis generate` or `genesis migrate config`, Genesis syncs relevant values to Unity `ProjectSettings/` and `ScriptableObject` assets. Manual edits in Unity Editor can be pulled back via `genesis config sync --from unity` (Phase 3).

---

## Game Configuration

Game-specific settings when `project.type === 'game'`.

```typescript
game: {
  genre: 'puzzle',                   // 'rpg' | 'puzzle' | 'idle' | 'runner' | ...
  monetization: 'f2p',               // 'f2p' | 'premium' | 'hybrid'
  platform: 'mobile',                // 'mobile' | 'desktop' | 'web'

  coreLoop: {
    sessionMinutes: 5,
    actionsPerMinute: 12,
  },

  systems: {
    enabled: ['levels', 'lives', 'stars', 'hints'],
    optional: ['leaderboard', 'daily-rewards'],
  },

  economy: {
    currencies: ['coins', 'gems'],
    energySystem: true,
    livesSystem: true,
  },

  liveops: {
    enabled: false,                  // enable via genesis generate liveops
    features: ['events', 'season-pass', 'daily-rewards'],
  },
},
```

---

## Plugin Configuration

Plugins receive typed configuration blocks under `plugins.{pluginId}`.

```typescript
plugins: {
  /** Globally enabled plugins for this project */
  enabled: ['unity', 'nestjs', 'firebase'],

  /** Plugin-specific configuration */
  unity: {
    editorPath: process.env.UNITY_EDITOR_PATH,
    hubPath: process.env.UNITY_HUB_PATH,
  },

  nestjs: {
    strictMode: true,
    swagger: true,
  },

  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    serviceAccount: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    services: ['auth', 'analytics', 'remote-config', 'firestore'],
  },

  aws: {
    region: process.env.AWS_REGION ?? 'us-east-1',
    profile: process.env.AWS_PROFILE,
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  },
},
```

### Plugin Config Contract

Each plugin declares its config schema in its manifest:

```json
{
  "id": "firebase",
  "configSchema": "./schema/firebase.config.json"
}
```

Genesis validates `plugins.firebase` against the plugin schema on load.

| Rule | Description |
|------|-------------|
| PL1 | Unknown plugin keys in `plugins` produce warnings |
| PL2 | Disabled plugins ignore their config block |
| PL3 | Plugin secrets use `process.env.*` references only |
| PL4 | Plugins cannot read other plugins' config directly |

---

## AI Provider Configuration

```typescript
ai: {
  enabled: true,
  enrichOnCreate: true,              // AI enrichment during genesis create

  defaultProvider: 'openai',
  fallbackProvider: 'anthropic',

  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
      defaultModel: 'gpt-4o',
      embeddingModel: 'text-embedding-3-small',
      maxTokens: 8192,
      temperature: 0.2,
    },

    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
      defaultModel: 'claude-sonnet-4-20250514',
      maxTokens: 8192,
    },

    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      defaultModel: 'gemini-2.0-flash',
    },

    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434',
      defaultModel: 'llama3.2',
    },
  },

  rag: {
    enabled: true,
    provider: 'local',               // 'local' | 'pinecone' | 'pgvector'
    sources: ['knowledge/', 'standards/', 'specs/'],
    topK: 5,
    maxContextTokens: 8000,
  },

  guardrails: {
    level: 'standard',               // 'permissive' | 'standard' | 'strict'
    blockSecrets: true,
    requireApproval: ['file-write', 'deploy'],
  },

  budget: {
    maxTokensPerSession: 100_000,
    maxCostPerSession: 5.00,         // USD
    warnAt: 0.8,                     // 80% of budget
  },

  agents: {
    planner: { provider: 'openai', model: 'gpt-4o' },
    reviewer: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' },
    documenter: { provider: 'openai', model: 'gpt-4o-mini' },
  },
},
```

### AI Provider Schema

| Key | Type | Description |
|-----|------|-------------|
| `defaultProvider` | string | Primary LLM provider ID |
| `fallbackProvider` | string | Used when primary fails (5s timeout) |
| `providers.{id}.apiKey` | env ref | **Never hardcode** |
| `providers.{id}.defaultModel` | string | Default model for provider |
| `rag.sources` | string[] | Directories for RAG retrieval |
| `guardrails.level` | enum | Safety strictness |
| `budget.maxTokensPerSession` | number | Session token cap |

### Provider Environment Variables

| Provider | Required Env Vars |
|----------|-------------------|
| OpenAI | `OPENAI_API_KEY` |
| Anthropic | `ANTHROPIC_API_KEY` |
| Gemini | `GEMINI_API_KEY` |
| Ollama | `OLLAMA_BASE_URL` (optional) |

---

## Deployment Configuration

```typescript
deploy: {
  defaultEnvironment: 'staging',

  environments: {
    local: {
      apiUrl: 'http://localhost:3000',
      cdnUrl: null,
      debug: true,
    },

    staging: {
      apiUrl: 'https://api-staging.ocean-quest.example.com',
      cdnUrl: 'https://cdn-staging.ocean-quest.example.com',
      debug: true,
      backend: {
        target: 'docker',
        registry: process.env.DOCKER_REGISTRY,
        image: 'ocean-quest-api',
        tag: '${project.version}',
      },
    },

    production: {
      apiUrl: 'https://api.ocean-quest.example.com',
      cdnUrl: 'https://cdn.ocean-quest.example.com',
      debug: false,
      backend: {
        target: 'docker',
        registry: process.env.DOCKER_REGISTRY,
        image: 'ocean-quest-api',
        tag: '${project.version}',
        replicas: 3,
        healthCheck: '/api/v1/health',
      },
      unity: {
        android: {
          track: 'internal',         // Play Console track
          signing: process.env.ANDROID_KEYSTORE_PATH,
        },
        ios: {
          method: 'app-store',
          teamId: process.env.APPLE_TEAM_ID,
        },
      },
    },
  },

  ci: {
    provider: 'github-actions',      // 'github-actions' | 'gitlab-ci'
    workflow: './.github/workflows/release.yml',
  },

  smokeTest: {
    enabled: true,
    endpoints: ['/api/v1/health'],
    timeout: 30_000,
  },
},
```

### Deploy Environment Resolution

```mermaid
flowchart LR
    A[genesis deploy --env staging] --> B{deploy.environments.staging}
    B --> C[Merge with genesis.config.ts base]
    C --> D[Apply .env.staging secrets]
    D --> E[Resolved DeployConfig]
```

| Command | Resolves |
|---------|----------|
| `genesis deploy --env staging` | `deploy.environments.staging` |
| `genesis deploy --env production` | `deploy.environments.production` |
| `GENESIS_MODE=production genesis deploy` | Uses `mode` to select environment |

---

## Secrets Management

### Principles

| # | Principle |
|---|-----------|
| S1 | **Never commit secrets** — `.env` is gitignored; config references `process.env.*` only |
| S2 | **Never log secrets** — redacted in all log levels including `--debug` |
| S3 | **Never embed in templates** — template variables cannot resolve secret values |
| S4 | **Validate absence** — `genesis validate secrets` scans for leaked credentials |
| S5 | **Separate per environment** — `.env.staging`, `.env.production` |

### Secret Storage Layers

| Layer | File | Committed | Example |
|-------|------|-----------|---------|
| Project secrets | `.env` | no | `DATABASE_URL`, `JWT_SECRET` |
| Environment secrets | `.env.staging` | no | Staging-specific keys |
| Global secrets | `~/.genesis/.env` | no | `OPENAI_API_KEY` |
| CI secrets | GitHub Actions secrets | no | Injected as env vars |
| Config references | `genesis.config.ts` | yes | `process.env.DATABASE_URL` |

### `.env.example` Template

Generated with every project:

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ocean_quest

# Auth
JWT_SECRET=change-me-in-production

# Redis
REDIS_URL=redis://localhost:6379

# Firebase
FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json

# AI (optional)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Deployment
DOCKER_REGISTRY=
ANDROID_KEYSTORE_PATH=
APPLE_TEAM_ID=
```

### Secret Redaction in Output

`genesis config show` redacts values matching patterns:

| Pattern | Redaction |
|---------|-----------|
| `*secret*`, `*password*`, `*token*`, `*key*`, `*credential*` | `[REDACTED]` |
| `DATABASE_URL`, `JWT_SECRET`, `*_API_KEY` | `[REDACTED]` |
| File paths to `secrets/` | shown (paths are not secret) |

### Secret Validation

```bash
genesis validate secrets
genesis validate secrets --strict
```

Scans for:
- Hardcoded API keys (regex patterns for OpenAI, AWS, Firebase, etc.)
- `.env` files tracked by git
- Secret values in `genesis.config.ts` string literals (must use `process.env`)

---

## Environment Overrides

### Environment Files

Loaded in order (later overrides earlier):

```
.env                    # Shared defaults
.env.local              # Local overrides (gitignored)
.env.{mode}             # Mode-specific (.env.development)
.env.{mode}.local       # Mode + local
```

### `GENESIS_*` Environment Variables

| Variable | Config Path | Example |
|----------|-------------|---------|
| `GENESIS_MODE` | mode | `production` |
| `GENESIS_LOG_LEVEL` | `cli.logLevel` | `debug` |
| `GENESIS_NO_COLOR` | `cli.color` | `1` (inverts) |
| `GENESIS_CONFIG` | config file path | `./custom.config.ts` |
| `GENESIS_DEFAULT_TEMPLATE` | `templates.project` | `mobile-puzzle` |
| `GENESIS_NO_INTERACTIVE` | `generation.interactive` | `1` |
| `GENESIS_PLUGIN_PATH` | plugin search path | `./packages/plugins` |
| `CI` | forces non-interactive | `true` |

### Dotenv Variable Expansion

`.env` files support expansion:

```bash
API_HOST=localhost
API_PORT=3000
API_URL=http://${API_HOST}:${API_PORT}
```

### CLI Flag Overrides

| Flag | Overrides |
|------|-----------|
| `--verbose` | `cli.logLevel` → `debug` |
| `--debug` | `cli.logLevel` → `trace` |
| `--quiet` | `cli.logLevel` → `error` |
| `--no-color` | `cli.color` → `false` |
| `--template` | `templates.project` |
| `--mode` | mode selection |
| `--config` | config file path |

---

## Validation

### Validation Triggers

| Trigger | Command | Scope |
|---------|---------|-------|
| Manual | `genesis config validate` | Full config |
| Section | `genesis config validate --section backend` | Partial |
| Pre-command | Before `create`, `generate`, `deploy` | Relevant sections |
| CI | `genesis config validate --strict` | Full + warnings as errors |

### Validation Rules

| Rule ID | Category | Severity | Description |
|---------|----------|----------|-------------|
| `CFG-001` | schema | error | Config must parse without TypeScript/syntax errors |
| `CFG-002` | schema | error | `project.name` must be kebab-case |
| `CFG-003` | schema | error | `project.version` must be valid semver |
| `CFG-004` | schema | error | `project.type` must be valid enum |
| `CFG-005` | refs | error | `templates.project` must reference existing template |
| `CFG-006` | refs | warning | Unknown keys at any level |
| `CFG-007` | secrets | error | No literal secrets in config file |
| `CFG-008` | secrets | error | `.env` must not be tracked by git |
| `CFG-009` | paths | error | `output.dirs.*` must be relative, no `..` traversal |
| `CFG-010` | backend | error | `database.url` required when `backend` section present |
| `CFG-011` | unity | error | `unity.bundleId` required for game projects |
| `CFG-012` | unity | warning | `unity.version` mismatch with installed Editor |
| `CFG-013` | plugins | error | `plugins.enabled` plugins must be installed |
| `CFG-014` | plugins | warning | Plugin config fails schema validation |
| `CFG-015` | ai | warning | AI enabled but no provider API key in env |
| `CFG-016` | deploy | error | `deploy.environments.{env}.apiUrl` required for defined envs |
| `CFG-017` | consistency | warning | `game.genre` mismatch with `project.template` genre |

### Validation Output

```
 Config Validation — ocean-quest

 ✓ CFG-001  Config parses successfully
 ✓ CFG-002  project.name is valid kebab-case
 ✓ CFG-003  project.version is valid semver
 ✓ CFG-007  No literal secrets in genesis.config.ts
 ! CFG-012  unity.version 6000.0 — Unity Editor not detected locally
 ✓ CFG-013  All enabled plugins installed

 5 passed, 1 warning, 0 errors
```

### Error Codes

| Code | When |
|------|------|
| `CONFIG_NOT_FOUND` | No `genesis.config.ts` in project |
| `CONFIG_PARSE_ERROR` | TypeScript/syntax error in config |
| `CONFIG_VALIDATION_ERROR` | Schema validation failed |
| `CONFIG_SECRET_DETECTED` | Literal secret in config file |
| `CONFIG_PLUGIN_SCHEMA_ERROR` | Plugin config block invalid |

---

## Config Load Sequence

```mermaid
sequenceDiagram
    actor User
    participant CLI as genesis CLI
    participant Loader as Config Loader
    participant TS as TS Evaluator
    participant Env as Env Files
    participant Val as Config Validator

    User->>CLI: genesis create game ocean-quest
    CLI->>Loader: load({ cwd, mode, flags })

    Loader->>Loader: applyBuiltinDefaults()
    Loader->>TS: evaluate(~/.genesis/config.ts)
    Loader->>TS: evaluate(./genesis.config.ts)
    Loader->>TS: evaluate(./.genesis/local.config.ts) [if exists]
    Loader->>Env: loadDotenv(.env, .env.local, .env.{mode})
    Loader->>Loader: applyEnvVars(GENESIS_*)
    Loader->>Loader: applyCliFlags(flags)
    Loader->>Val: validate(resolved)

    alt validation fails
        Val-->>CLI: ConfigValidationError
        CLI-->>User: Error + fix hints
    else validation passes
        Val-->>Loader: Valid
        Loader-->>CLI: ResolvedConfiguration
        CLI->>CLI: execute command
    end
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `genesis config show` | Print resolved config (secrets redacted) |
| `genesis config show --section backend` | Print one section |
| `genesis config validate` | Validate config against schema |
| `genesis config init` | Create default `genesis.config.ts` |
| `genesis config init --global` | Create `~/.genesis/config.ts` |
| `genesis config edit` | Open config in `$EDITOR` |
| `genesis config set <key> <value>` | Set value (writes to config) |
| `genesis config get <key>` | Get single value |
| `genesis config path` | Print active config file path |
| `genesis config sync --from unity` | Pull Unity settings into config |
| `genesis config sync --to unity` | Push config to Unity settings |
| `genesis migrate config` | Migrate YAML → TypeScript |

---

## Complete Examples

### Example 1 — Minimal Backend API

```typescript
// genesis.config.ts
import { defineConfig } from '@genesis/config';

export default defineConfig({
  project: {
    name: 'inventory-api',
    type: 'backend',
    template: 'backend-api',
    version: '1.0.0',
    author: 'Alex Chen',
  },

  output: {
    root: '.',
    dirs: { backend: './backend', docs: './docs' },
  },

  backend: {
    framework: 'nestjs',
    port: 3000,
    database: {
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    auth: {
      enabled: true,
      jwtSecret: process.env.JWT_SECRET,
    },
  },
});
```

### Example 2 — Full Mobile Game

```typescript
// genesis.config.ts
import { defineConfig } from '@genesis/config';

export default defineConfig({
  $schema: 'https://project-genesis.dev/schema/config-v1.json',

  project: {
    name: 'ocean-quest',
    type: 'game',
    template: 'mobile-puzzle',
    version: '0.1.0',
    author: 'Studio Alpha',
    license: 'Proprietary',
  },

  generation: {
    overwritePolicy: 'skip',
    validateAfterGenerate: true,
    variables: {
      company: 'Studio Alpha Inc.',
    },
  },

  output: {
    root: '.',
    dirs: {
      backend: './backend',
      unity: './unity',
      docs: './docs',
    },
  },

  game: {
    genre: 'puzzle',
    monetization: 'f2p',
    systems: {
      enabled: ['levels', 'lives', 'stars', 'hints'],
    },
  },

  backend: {
    framework: 'nestjs',
    port: 3000,
    database: {
      type: 'postgres',
      url: process.env.DATABASE_URL,
    },
    cache: {
      enabled: true,
      url: process.env.REDIS_URL,
    },
    docker: {
      enabled: true,
      services: ['postgres', 'redis'],
    },
  },

  unity: {
    version: '6000.0',
    renderPipeline: 'urp',
    dimension: '2d',
    targetPlatforms: ['ios', 'android'],
    project: {
      companyName: 'Studio Alpha',
      productName: 'Ocean Quest',
      bundleId: 'com.studioalpha.oceanquest',
    },
    performance: { targetFps: 60 },
    services: {
      analytics: { provider: 'firebase' },
      ads: { enabled: true, provider: 'admob', testMode: true },
      cloudSave: { provider: 'firebase' },
    },
  },

  plugins: {
    enabled: ['unity', 'nestjs', 'firebase'],
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      services: ['auth', 'analytics', 'remote-config'],
    },
  },

  ai: {
    enabled: true,
    defaultProvider: 'openai',
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4o',
      },
    },
    guardrails: { level: 'standard' },
  },

  deploy: {
    defaultEnvironment: 'staging',
    environments: {
      staging: {
        apiUrl: 'https://api-staging.ocean-quest.example.com',
        backend: {
          target: 'docker',
          registry: process.env.DOCKER_REGISTRY,
          image: 'ocean-quest-api',
        },
      },
      production: {
        apiUrl: 'https://api.ocean-quest.example.com',
        backend: {
          target: 'docker',
          registry: process.env.DOCKER_REGISTRY,
          image: 'ocean-quest-api',
          replicas: 3,
        },
      },
    },
  },
});
```

### Example 3 — Mode-Aware with Async Config

```typescript
// genesis.config.ts
import { defineConfig } from '@genesis/config';
import { readFile } from 'node:fs/promises';

export default defineConfig(async ({ mode }) => {
  const pkg = JSON.parse(await readFile('./package.json', 'utf-8'));

  return {
    project: {
      name: 'ocean-quest',
      type: 'game',
      template: 'mobile-puzzle',
      version: pkg.version,
    },

    backend: {
      port: mode === 'production' ? 8080 : 3000,
      database: {
        type: 'postgres',
        url: process.env.DATABASE_URL,
      },
    },

    deploy: {
      environments: {
        [mode]: {
          apiUrl: process.env.API_URL,
        },
      },
    },
  };
});
```

### Example 4 — Global User Config

```typescript
// ~/.genesis/config.ts
import { defineGlobalConfig } from '@genesis/config';

export default defineGlobalConfig({
  user: {
    name: 'Alex Chen',
    email: 'alex@studio.example.com',
  },

  defaults: {
    author: 'Alex Chen',
    license: 'MIT',
  },

  cli: {
    color: true,
    logLevel: 'info',
  },

  ai: {
    defaultProvider: 'openai',
    providers: {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        defaultModel: 'gpt-4o',
      },
      ollama: {
        baseUrl: 'http://localhost:11434',
        defaultModel: 'llama3.2',
      },
    },
    budget: {
      maxTokensPerSession: 100_000,
    },
  },

  plugins: {
    registry: 'https://registry.project-genesis.dev',
  },
});
```

### Example 5 — Local Developer Overrides

```typescript
// .genesis/local.config.ts (gitignored)
import { defineConfig } from '@genesis/config';

export default defineConfig({
  backend: {
    port: 3001,  // avoid conflict with other project
  },

  unity: {
    services: {
      ads: { testMode: true },
    },
  },

  cli: {
    logLevel: 'debug',
  },
});
```

---

## `.genesis/` Directory

Runtime metadata managed by Genesis — not hand-edited except `local.config.ts`.

```
.genesis/
├── local.config.ts          # Developer overrides (gitignored)
├── metadata.json            # Genesis-managed project metadata
├── config.lock.json         # Resolved config hash
├── generation-report.json   # Last generation summary
├── reports/                 # Validation and analysis reports
│   └── validate-2026-07-26.json
├── generated/               # Ephemeral codegen cache (gitignored)
└── templates/               # Project-local templates (optional)
    └── games/
```

### `metadata.json`

```json
{
  "genesisVersion": "0.1.0",
  "template": "mobile-puzzle",
  "templateVersion": "1.2.0",
  "createdAt": "2026-07-26T12:00:00Z",
  "lastGeneratedAt": "2026-07-26T14:30:00Z",
  "configHash": "sha256:abc123..."
}
```

---

## Type Definitions Export

Generated projects include a typed reference:

```typescript
// genesis.config.ts
import { defineConfig } from '@genesis/config';

// Provides full autocomplete for all config keys
export default defineConfig({
  // ...
});

// Optional: export resolved type for use in scripts
import type { GenesisConfig } from '@genesis/config';
```

---

## Migration from YAML

```bash
genesis migrate config
```

| Step | Action |
|------|--------|
| 1 | Read `.genesis/config.yml` or `genesis.config.yml` |
| 2 | Map keys to `genesis.config.ts` schema |
| 3 | Write `genesis.config.ts` |
| 4 | Rename YAML to `.genesis/config.yml.bak` |
| 5 | Run `genesis config validate` |
| 6 | Update `.gitignore` for `.genesis/local.config.ts` |

---

## Related Documents

| Document | Relationship |
|----------|-------------|
| [FUNCTIONAL_SPEC.md](FUNCTIONAL_SPEC.md) | Config loader in CLI lifecycle |
| [COMMAND_REFERENCE.md](COMMAND_REFERENCE.md) | `genesis config` commands |
| [CLI_USER_EXPERIENCE.md](CLI_USER_EXPERIENCE.md) | `genesis config show` output format |
| [004-scaffolding/FUNCTIONAL_SPEC.md](../004-scaffolding/FUNCTIONAL_SPEC.md) | Variable resolution from config |
| [005-ai-engine/FUNCTIONAL_SPEC.md](../005-ai-engine/FUNCTIONAL_SPEC.md) | AI provider configuration |
| [007-backend/FUNCTIONAL_SPEC.md](../007-backend/FUNCTIONAL_SPEC.md) | Backend config consumption |
| [008-unity/FUNCTIONAL_SPEC.md](../008-unity/FUNCTIONAL_SPEC.md) | Unity config consumption |
| [standards/security/secrets.md](../../standards/security/secrets.md) | Secret handling standards |

## Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-26 | Initial configuration system specification |
