import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Tests unitaires des fonctions pures (fichiers `.test.ts` sous `src`).
 *
 * L'alias `@/` est redéclaré ici : Vitest ne lit pas les chemins de
 * `tsconfig.json`. Un module testé ne doit pas importer `server-only`, qui
 * lève hors du rendu serveur de Next — c'est aussi ce qui garde ces fonctions
 * pures.
 */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"] },
});
