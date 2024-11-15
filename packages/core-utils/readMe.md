# setup to use `tsup`

- tsup is used for bundling

### Key benefits of tsup

- Much faster builds (uses esbuild)
- Built-in bundling
- Code splitting
- Tree shaking
- Multiple formats in one build / Modern output formats
- Simpler configuration
- Better bundle optimization
- Simpler configuration
- Built-in DTS generation

### Key benefits of tsc

- Direct TypeScript compilation
- More granular control
- No bundling (can be an advantage)
- Straightforward debugging
- Better for certain project types

```json

// Using tsc
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}

// Using tsup
{
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  }
}

```

##### example setup

```ts

// Package with multiple entry points
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/cli.ts',
    'src/utils/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  minify: true,
,
  treeshake: {
    moduleSideEffects: false
  },
  external: ['react'],
  outDir: 'dist'
})

```

__for application__

```js
// tsup.config.ts
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: process.env.NODE_ENV === "production",
  onSuccess: "node dist/index.js",
});
```

__for library__

```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "type-check": "tsc --noEmit"
  }
}
```
