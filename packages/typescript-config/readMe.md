# Config Explanation

```json
{
  "compilerOptions": {
    // Build Configuration
    "composite": false, // Don't use TypeScript's project references
    "outDir": "dist", // Compiled files go here
    "rootDir": "src", // Source files are here

    // Declaration Files
    "declaration": true, // Generate .d.ts files
    "declarationMap": true, // Generate sourcemaps for .d.ts files

    // Module System
    "moduleResolution": "node", // Use Node.js module resolution
    "esModuleInterop": true, // Better import/export compatibility
    "isolatedModules": true, // Files can be transpiled independently

    // Type Checking
    "strict": true, // Enable all strict type checks
    "strictNullChecks": true, // Explicit null/undefined handling

    // Development Experience
    "noUnusedLocals": false, // Don't error on unused variables
    "noUnusedParameters": false, // Don't error on unused parameters
    "preserveWatchOutput": true, // Better watch mode output

    // Performance & Compatibility
    "skipLibCheck": true, // Faster builds
    "forceConsistentCasingInFileNames": true, // Prevent casing issues
    "inlineSources": false // Keep sourcemaps separate
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

** for developement **

```js

// This works because of esModuleInterop
import express from 'express';

// This works because of strict & strictNullChecks
function processUser(user: { name: string | null }) {
  if (user.name) {
    console.log(user.name.toUpperCase());
  }
}

// This doesn't error because of noUnusedLocals: false
function handler(req: Request, res: Response, next: NextFunction) {
  // next is unused but that's okay
  res.json({ ok: true });
}

```
