import type { Ticket } from "./types.js";

export const CLAIM_TTL_MS = 20 * 60 * 1000;

interface Claim {
  ticketId: string;
  assistantId: string;
  claimedAt: number;
}

/**
 * Cola de asignación ciega: cada auxiliar pide "el siguiente" ticket y lo
 * reclama por 20 minutos. Si no lo resuelve en ese tiempo, el claim expira
 * y otra persona puede tomarlo.
 */
export class ClaimQueue {
  private readonly claims = new Map<string, Claim>();

  constructor(private readonly now: () => number = Date.now) {}

  /** Intenta reclamar un ticket. Devuelve true si quedó a nombre de `assistantId`. */
  claim(ticketId: string, assistantId: string): boolean {
    if (this.isHeldByOther(ticketId, assistantId)) return false;
    this.claims.set(ticketId, { ticketId, assistantId, claimedAt: this.now() });
    return true;
  }

  release(ticketId: string, assistantId: string): void {
    const claim = this.claims.get(ticketId);
    if (claim?.assistantId === assistantId) this.claims.delete(ticketId);
  }

  /** Siguiente ticket disponible para `assistantId`, ya reclamado. */
  next(tickets: Ticket[], assistantId: string): Ticket | null {
    for (const ticket of tickets) {
      if (this.claim(ticket.id, assistantId)) return ticket;
    }
    return null;
  }

  ownerOf(ticketId: string): string | null {
    return this.claims.get(ticketId)?.assistantId ?? null;
  }

  private isExpired(claim: Claim): boolean {
    return this.now() - claim.claimedAt >= CLAIM_TTL_MS;
  }

  private isHeldByOther(ticketId: string, assistantId: string): boolean {
    const claim = this.claims.get(ticketId);
    return claim !== undefined && claim.assistantId !== assistantId;
  }
}
