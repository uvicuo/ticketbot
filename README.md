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

### 2. Gate de revisión humana
Hoy `decide()` manda todo a facturación automática, y eso genera facturas con montos equivocados. Cambia `decide()` para que un ticket vaya a `NEEDS_REVIEW` cuando:

- el monto extraído difiere del monto reportado por el empleado en **más de 1 %**,
- `confidence < 0.8`, o
- el RFC no es válido. Formato: `^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$`.

`reasons` debe explicar **por qué**, para que la auxiliar no tenga que adivinar. Agrega tests. `fixtures/tickets.json` tiene casos útiles.

### 3. Bonus, si te sobra tiempo (elige uno, no pasa nada si no llegas)
- **a)** En producción la cola vive en Postgres y varias auxiliares piden "el siguiente" al mismo tiempo. ¿Cómo harías el claim atómico? Escribe el SQL o el pseudocódigo.
- **b)** ¿Cómo sabrías si el modelo está leyendo bien los montos? Propón (o escribe) una evaluación mínima sobre los fixtures.
