# Break down of `package.json`

1. Package Identity and Scope:

```json
{
  "name": "@hive/core-utils", // Scoped package name
  "version": "0.0.0", // Package version
  "private": true // Prevents accidental publishing
}
```

This tells us:

- Package is under `@hive` organization scope
- Initial version (not published)
- Private to the monorepo

2. Package Entry Points:

```json
{
  "main": "./dist/index.js", // CommonJS entry point
  "module": "./dist/index.mjs", // ES Modules entry point
  "types": "./dist/index.d.ts" // TypeScript types
}
```

usage examples

```ts
// CommonJS (will use main)
const utils = require("@hive/core-utils");

// ES Modules (will use module)
import { someUtil } from "@hive/core-utils";

// TypeScript (will use types)
import { SomeType } from "@hive/core-utils";
```

3. Build Scripts Configuration:

```json
{
  "scripts": {
    // Production build
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",

    // Development mode
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",

    // Cleanup
    "clean": "rm -rf dist",

    // Linting
    "lint": "eslint src/",

    // Type checking
    "type-check": "tsc --noEmit"
  }
}
```

```shell

tsup src/index.ts --format cjs,esm --dts --clean

```

Builds from src/index.ts
Generates both CommonJS (.js) and ESM (.mjs) formats
Creates TypeScript declarations (--dts)
Cleans output directory first (--clean)

sample output:

```
dist/
├── index.js      # CommonJS version
├── index.mjs     # ES Modules version
└── index.d.ts    # TypeScript declarations
```

```shell

tsup src/index.ts --format cjs,esm --dts --watch

```

Same as build but with:

Watch mode for file changes
Continuous rebuilding

Real-World Configuration Example:

```json
{
  "name": "@hive/core-utils",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "require": "./dist/index.js",
      "import": "./dist/index.mjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "clean": "rm -rf dist",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  },
  "devDependencies": {
    "@hive/eslint-config": "*",
    "@hive/typescript-config": "*",
    "tsup": "^6.7.0",
    "typescript": "^5.0.4",
    "vitest": "^0.34.0"
  },
  "peerDependencies": {
    "typescript": ">=4.0.0"
  }
}
```

This configuration:

- Supports both modern (ESM) and legacy (CommonJS) imports
- Provides proper TypeScript support
- Enables fast development with watch mode
- Includes testing setup
- Maintains clean builds
- Integrates with monorepo tooling
- Prevents accidental publishing
- Uses shared configurations

The setup is optimized for:

- Package development in a monorepo
- Type safety
- Modern and legacy compatibility
- Development experience
- Build performance


## set up subpath exports in your package to support granular imports.

1. Import everything:
```js

import { parseCustomRep, CustomError, Logger } from '@hive/core-utils';

```

2. Import from specific subpaths:

```js

// Import only from db
import { parseCustomRep } from '@hive/core-utils/db';

// Import only from exceptions
import { CustomError } from '@hive/core-utils/exceptions';

// Import only from logger
import { Logger } from '@hive/core-utils/logger';

```

Key aspects of this setup:

Package.json exports field:


Defines subpath exports for each directory
Supports both ESM and CommonJS
Includes type definitions


TypesVersions:


Enables TypeScript to find type definitions for subpaths
Matches the export paths structure


TSUP Configuration:


Multiple entry points for each subpath
Generates both ESM and CommonJS
Creates type definitions
Enables tree shaking


Directory Structure:


Clean separation of concerns
Index files for re-exports
Consistent pattern across submodules

Benefits:

Better tree shaking - users only import what they need
Cleaner imports - more explicit about what's being used
Better organization - logical separation of functionality
Type safety - full TypeScript support for all imports


```ts

// Directory Structure
/*
core-utils/
├── src/
│   ├── index.ts
│   ├── db/
│   │   ├── index.ts
│   │   └── parseCustomRep.ts
│   ├── exceptions/
│   │   ├── index.ts
│   │   └── CustomError.ts
│   └── logger/
│       ├── index.ts
│       └── Logger.ts
├── tsconfig.json
├── tsup.config.ts
└── package.json
*/

// src/db/parseCustomRep.ts
export function parseCustomRep(data: unknown): Record<string, any> {
  // Implementation
  return {};
}

// src/db/index.ts
export * from './parseCustomRep';

// src/exceptions/CustomError.ts
export class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomError';
  }
}

// src/exceptions/index.ts
export * from './CustomError';

// src/logger/Logger.ts
export class Logger {
  static log(message: string) {
    console.log(message);
  }
}

// src/logger/index.ts
export * from './Logger';

// src/index.ts
export * from './db';
export * from './exceptions';
export * from './logger';

// package.json
{
  "name": "@hive/core-utils",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./db": {
      "import": "./dist/db/index.mjs",
      "require": "./dist/db/index.js",
      "types": "./dist/db/index.d.ts"
    },
    "./exceptions": {
      "import": "./dist/exceptions/index.mjs",
      "require": "./dist/exceptions/index.js",
      "types": "./dist/exceptions/index.d.ts"
    },
    "./logger": {
      "import": "./dist/logger/index.mjs",
      "require": "./dist/logger/index.js",
      "types": "./dist/logger/index.d.ts"
    }
  },
  "typesVersions": {
    "*": {
      "*": ["./dist/*"],
      "db": ["./dist/db/index.d.ts"],
      "exceptions": ["./dist/exceptions/index.d.ts"],
      "logger": ["./dist/logger/index.d.ts"]
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist",
    "lint": "eslint src/",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@hive/eslint-config": "*",
    "@hive/typescript-config": "*",
    "tsup": "^6.7.0",
    "typescript": "^5.0.4"
  }
}

// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/db/index.ts',
    'src/exceptions/index.ts',
    'src/logger/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  treeshake: true,
  outDir: 'dist'
});

// tsconfig.json
{
  "extends": "@hive/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@hive/core-utils": ["./src/index.ts"],
      "@hive/core-utils/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}

```