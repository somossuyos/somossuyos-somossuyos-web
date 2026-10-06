# Checklist E2E — Wompi Sandbox + SkillCert (web principal)

Perfil SSO `somossuyos-renaser` (cuenta `475029594948`) no incluye `dynamodb:*` ni `amplify:*`.
Completar estos pasos con un rol/admin que sí los tenga.

## DynamoDB

```bash
AWS_PROFILE=<admin> AWS_REGION=us-east-1 ./scripts/aws/setup-renaser-orders.sh
aws dynamodb describe-table --table-name SomosSuyosCheckoutOrders --region us-east-1
```

Esperado: `ACTIVE`, PK `reference`, `PAY_PER_REQUEST`.

## IAM runtime Amplify (Lambda SSR)

Adjuntar a la role de ejecución de la app web (ver `docs/aws-iam-renaser-orders.md`):

- `dynamodb:GetItem`, `PutItem`, `UpdateItem`
- Resource: `arn:aws:dynamodb:us-east-1:475029594948:table/SomosSuyosCheckoutOrders`

## Variables Amplify (web principal)

| Variable | Valor |
|----------|--------|
| `SOMOSSUYOS_ORDERS_TABLE_NAME` | `SomosSuyosCheckoutOrders` |
| `SKILLCERT_API_URL` | `https://skillcertacademy.somossuyos.com` |
| `SKILLCERT_PROVISION_KEY_ID` | `somossuyos-renaser-2026` |
| `SKILLCERT_PROVISION_SECRET` | **Mismo valor que en el aula (renaser-virtual)** — no rotar |
| `NEXT_PUBLIC_MEMORIAS_COMING_SOON` | `false` |
| `WOMPI_PUBLIC_KEY` / `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | `pub_test_…` |
| `WOMPI_INTEGRITY_SECRET` | `test_integrity_…` |
| `WOMPI_EVENTS_SECRET` | `test_events_…` |

No usar claves `pub_prod_` / `prod_*` para esta prueba.

## Wompi Sandbox dashboard

Event URL: `https://www.somossuyos.com/api/wompi/webhook`

Flujo: Wompi → webhook web → POST HMAC al aula.

## Smoke post-deploy

1. GET `/tienda/curso/memorias-en-video-del-congreso` → 200, botón **Comprar acceso**
2. Carrito → checkout → widget Wompi: `pub_test_`, reference `ss-renaser-*`, `25000000` COP
3. Detenerse antes de pagar (primera pasada)
