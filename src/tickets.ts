import { readFile } from "node:fs/promises";
import type { Ticket } from "./types.js";

export async function loadTickets(): Promise<Ticket[]> {
  const raw = await readFile(new URL("../fixtures/tickets.json", import.meta.url), "utf8");
  return JSON.parse(raw) as Ticket[];
}
