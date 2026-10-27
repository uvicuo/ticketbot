import { describe, expect, it } from "vitest";
import { FixtureExtractor } from "../src/extract.js";

describe("FixtureExtractor", () => {
  const extractor = new FixtureExtractor();

  it("lee la extracción grabada de un ticket", async () => {
    await expect(extractor.extract("img-001")).resolves.toEqual({
      amount: 145.0,
      rfc: "TBO200101AB1",
      confidence: 0.95,
    });
  });

  it("rechaza respuestas del modelo que no cumplen el schema", async () => {
    await expect(extractor.extract("img-bad")).rejects.toThrow();
  });
});
