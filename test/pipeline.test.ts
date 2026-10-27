import { describe, expect, it } from "vitest";
import { FixtureExtractor } from "../src/extract.js";
import { decide } from "../src/pipeline.js";
import { loadTickets } from "../src/tickets.js";

describe("decide", () => {
  it("un ticket limpio va a facturación automática", async () => {
    const [t1] = await loadTickets();
    const decision = await decide(t1, new FixtureExtractor());
    expect(decision.status).toBe("AUTO_INVOICE");
    expect(decision.reasons).toEqual([]);
  });
});
