# TicketBot

Una empresa reembolsa gastos de sus empleados en carretera (casetas y gasolina). Para que el gasto sea deducible necesita una **factura (CFDI)**. El empleado sube la foto de su ticket y, a partir de ahí:

1. Un **modelo de visión** lee la foto y extrae `amount`, el `rfc` del comercio y un `confidence` de 0 a 1 (`src/extract.ts`).
2. `decide()` resuelve si el ticket se **factura automáticamente** (un bot entra al portal del comercio) o pasa a **revisión humana** (`src/pipeline.ts`).
3. Los tickets de revisión humana los resuelve un equipo de auxiliares contables con una cola de **asignación ciega**: cada persona pide "el siguiente" y lo reclama por 20 minutos (`src/queue.ts`).

En este repo el modelo está simulado: `FixtureExtractor` reproduce respuestas grabadas en `fixtures/extractions/`. No necesitas API keys ni red.

```bash
npm install
npm test
```

## Tareas

Usa las herramientas de AI que usas normalmente. Piensa en voz alta: nos interesa más **cómo trabajas** que terminar todo.

### 1. Hay un test roto
`npm test` tiene un test que falla. Explica la causa antes de arreglarlo.

### 2. Facturas con montos equivocados
Hoy `decide()` manda **todo** a facturación automática. Resultado: se están emitiendo facturas con montos equivocados, y una factura mal emitida es un problema fiscal que hay que cancelar y rehacer.

Por otro lado, las auxiliares ya están saturadas: si mandamos todo a revisión humana, no les da la vida.

En `fixtures/` hay tickets leídos por el modelo (`tickets.json` + `extractions/`). Algunos los leyó bien y otros no.

1. **Antes de programar**, cuéntanos en 2–3 minutos qué propones y por qué.
2. Impleméntalo en `decide()`, con tests.

### 3. Bonus, si te sobra tiempo (elige uno, no pasa nada si no llegas)
- **a)** En producción la cola vive en Postgres y varias auxiliares piden "el siguiente" al mismo tiempo. ¿Cómo harías el claim atómico? Escribe el SQL o el pseudocódigo.
- **b)** ¿Cómo sabrías si el modelo está leyendo bien los montos? Propón (o escribe) una evaluación mínima sobre los fixtures.
