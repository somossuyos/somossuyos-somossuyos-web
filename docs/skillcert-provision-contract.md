# Contrato: provision-access (SkillCert Academy)

Integración server-to-server desde **www.somossuyos.com** hacia el aula en **skillcertacademy.somossuyos.com**.

> Este documento describe el contrato esperado en el aula. La implementación del endpoint vive en el repositorio del aula, no en este proyecto.

## Endpoint

```
POST {SKILLCERT_API_URL}/api/internal/provision-access
```

Default `SKILLCERT_API_URL`: `https://skillcertacademy.somossuyos.com`

## Headers (HMAC)

| Header | Descripción |
|--------|-------------|
| `Content-Type` | `application/json` |
| `X-SkillCert-Key-Id` | Identificador de clave (`SKILLCERT_PROVISION_KEY_ID`) |
| `X-SkillCert-Timestamp` | Unix epoch segundos (string) |
| `X-SkillCert-Nonce` | UUID único por request |
| `X-SkillCert-Signature` | HMAC-SHA256 hex |

### Firma

```
signature = HMAC-SHA256(
  timestamp + "." + nonce + "." + rawBody,
  SKILLCERT_PROVISION_SECRET
)
```

- `rawBody` = cuerpo JSON exacto enviado (sin re-serializar distinto).
- El aula debe validar con **comparación timing-safe**.
- **Anti-replay (aula):** rechazar si `timestamp` está fuera de ±5 minutos; rechazar `nonce` reutilizado.
- **Idempotencia (aula):** misma pareja `orderReference` + `transactionId` → `200 already_provisioned`.

## Payload JSON

```json
{
  "email": "comprador@example.com",
  "firstName": "Nombre",
  "lastName": "Apellido",
  "productId": "renaser-2026",
  "sourceProductId": "20260720",
  "orderReference": "ss-renaser-uuid",
  "transactionId": "wompi-transaction-id",
  "amountInCents": 25000000,
  "currency": "COP"
}
```

| Campo | Origen en Somos Suyos |
|-------|------------------------|
| `email`, `firstName`, `lastName` | Orden Dynamo `SomosSuyosCheckoutOrders` (checkout `/carrito`) |
| `sourceProductId` | `20260720` (Memorias RenaSER) |
| `productId` | `renaser-2026` (catálogo SkillCert) |
| `orderReference` | Referencia Wompi / PK Dynamo |
| `transactionId` | `transaction.id` del webhook Wompi |
| `amountInCents`, `currency` | Orden persistida (validada contra Wompi) |

## Respuestas esperadas

| HTTP | Significado |
|------|-------------|
| `200` | Acceso provisionado (`provisioned`) |
| `200` | Ya provisionado (`already_provisioned` — cuerpo puede indicarlo) |
| `400` | Payload inválido |
| `401` | Firma / timestamp / nonce inválidos |
| `409` | Conflicto de estado (opcional) |
| `500` | Error interno del aula |

Somos Suyos marca `provisioningStatus=COMPLETED` en éxito `200`; `FAILED` en otros casos (reintento manual vía `retryRenaserProvisioning`).

## Variables de entorno (Somos Suyos)

- `SKILLCERT_API_URL`
- `SKILLCERT_PROVISION_KEY_ID`
- `SKILLCERT_PROVISION_SECRET`

No registrar valores de secretos en logs.
