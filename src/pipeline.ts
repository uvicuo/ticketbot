import type { Extraction, Extractor } from "./extract.js";
import type { Ticket } from "./types.js";

export type DecisionStatus = "AUTO_INVOICE" | "NEEDS_REVIEW";

export interface Decision {
  ticketId: string;
  status: DecisionStatus;
  reasons: string[];
  extraction: Extraction;
}

/**
 * Decide si un ticket se manda a facturación automática (un bot entra al
 * portal del comercio y genera la factura) o si lo revisa una persona.
 */
export async function decide(ticket: Ticket, extractor: Extractor): Promise<Decision> {
  const extraction = await extractor.extract(ticket.imageRef);

  // Hoy todo lo que el modelo lee se factura automáticamente.
  return { ticketId: ticket.id, status: "AUTO_INVOICE", reasons: [], extraction };
}
