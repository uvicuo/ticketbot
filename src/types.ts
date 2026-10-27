export type TicketKind = "toll" | "fuel";

/** Un gasto que un empleado reportó, con la foto de su ticket. */
export interface Ticket {
  id: string;
  employeeId: string;
  kind: TicketKind;
  /** Monto que el empleado dice que gastó (MXN). */
  reportedAmount: number;
  /** Referencia a la foto del ticket. */
  imageRef: string;
}
