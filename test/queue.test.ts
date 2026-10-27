import { describe, expect, it } from "vitest";
import { CLAIM_TTL_MS, ClaimQueue } from "../src/queue.js";
import { loadTickets } from "../src/tickets.js";

function clock(start = 0) {
  let t = start;
  return { now: () => t, advance: (ms: number) => (t += ms) };
}

describe("ClaimQueue", () => {
  it("asigna un ticket libre a quien lo pide", () => {
    const q = new ClaimQueue(clock().now);
    expect(q.claim("t1", "ana")).toBe(true);
    expect(q.ownerOf("t1")).toBe("ana");
  });

  it("no deja que otra persona tome un ticket con claim vigente", () => {
    const c = clock();
    const q = new ClaimQueue(c.now);
    q.claim("t1", "ana");
    c.advance(CLAIM_TTL_MS - 1);
    expect(q.claim("t1", "beto")).toBe(false);
    expect(q.ownerOf("t1")).toBe("ana");
  });

  it("otra persona puede tomar un ticket cuyo claim expiró", () => {
    const c = clock();
    const q = new ClaimQueue(c.now);
    q.claim("t1", "ana");
    c.advance(CLAIM_TTL_MS);
    expect(q.claim("t1", "beto")).toBe(true);
    expect(q.ownerOf("t1")).toBe("beto");
  });

  it("next() salta tickets reclamados por otros", async () => {
    const tickets = await loadTickets();
    const q = new ClaimQueue(clock().now);
    expect(q.next(tickets, "ana")?.id).toBe("t1");
    expect(q.next(tickets, "beto")?.id).toBe("t2");
  });

  it("release() libera el ticket", () => {
    const q = new ClaimQueue(clock().now);
    q.claim("t1", "ana");
    q.release("t1", "ana");
    expect(q.claim("t1", "beto")).toBe(true);
  });
});
