import { readFile } from "node:fs/promises";
import { z } from "zod";

/** Lo que el modelo de visión devuelve al leer la foto de un ticket. */
export const ExtractionSchema = z.object({
  amount: z.number().nullable(),
  rfc: z.string().nullable(),
  confidence: z.number().min(0).max(1),
});

export type Extraction = z.infer<typeof ExtractionSchema>;

export interface Extractor {
  extract(imageRef: string): Promise<Extraction>;
}

/**
 * En producción esto llama a un modelo de visión (LLM).
 * Aquí reproduce respuestas grabadas en fixtures/extractions/<imageRef>.json
 * para no depender de red ni de API keys.
 */
export class FixtureExtractor implements Extractor {
  constructor(private readonly dir = new URL("../fixtures/extractions/", import.meta.url)) {}

  async extract(imageRef: string): Promise<Extraction> {
    const raw = await readFile(new URL(`${imageRef}.json`, this.dir), "utf8");
    return ExtractionSchema.parse(JSON.parse(raw));
  }
}
