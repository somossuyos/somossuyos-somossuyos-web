# RenaSER 2026 — Auditoría flujo de compra + invitaciones

## Mapa end-to-end (producción actual)

```
INVITATION (lista cerrada)
  → email con enlace /renaser/invitacion?t=… (token opaco, solo hash en Dynamo)
  → POST /api/renaser/invitation/exchange → cookie HttpOnly renaser_inv (tokenHash)
CHECKOUT
  → tienda memorias / carrito → POST /api/wompi/create-order
  → referencia ss-renaser-{uuid} (buildRenaserOrderReference)
  → guarda SomosSuyosCheckoutOrders (PENDING) + invitationTokenHash
  → abre checkout.wompi.co (RENASER_WOMPI_* si productId 20260720)
WOMPI
  → transaction.updated APPROVED/DECLINED/…
WEBHOOK
  → POST /api/wompi/webhook (pages/api/wompi/webhook.ts)
  → evaluateWompiWebhookAuth (RENASER events secret si ss-renaser-*)
  → processWompiTransactionUpdate
ORDER
  → updateCheckoutOrderStatus en SomosSuyosCheckoutOrders
  → DECLINED/ERROR/VOIDED: releaseInvitationReservation (vuelve AVAILABLE)
  → APPROVED: validateRenaserApprovedPayment (25000000 COP, productId 20260720)
  → consumeInvitationOnApprovedPayment → PURCHASED (atómico)
PROVISIONING
  → provisionSkillCertAccess → POST skillcertacademy…/api/internal/provision-access (HMAC)
AULA (renaser-virtual)
  → Cognito user + RenaSEREntitlements + RenaSERProvisionedOrders
EMAIL (aula)
  → ACTIVATION o ACCESS_ENABLED vía SES RenaSERTransactional
CAMPUS
  → login + entitlement ACTIVE (sin token de compra en campus)
```

## Archivos clave (somossuyos-web)

| Paso | Ubicación |
|------|-----------|
| Landing invitación | `pages/renaser/invitacion.tsx` |
| Exchange token → cookie | `pages/api/renaser/invitation/exchange.ts` |
| Sesión invitación | `src/lib/renaserInvitations/session.ts` |
| Guard checkout | `src/lib/renaserInvitations/checkoutGuard.ts` |
| Create order | `pages/api/wompi/create-order.ts` |
| Webhook | `pages/api/wompi/webhook.ts` |
| Procesamiento | `src/lib/wompi/processWompiTransaction.ts` |
| Órdenes Dynamo | `src/lib/orders/checkoutOrdersRepository.ts` |
| Invitaciones Dynamo | `src/lib/renaserInvitations/repository.ts` |
| SkillCert call | `src/lib/skillcert/provision.ts` |

## Archivos clave (renaser-virtual / aula)

| Paso | Ubicación |
|------|-----------|
| Provision API | `src/app/api/internal/provision-access/route.ts` |
| Lógica provision | `src/lib/skillcert-provision/provision-access.ts` |
| Emails | `src/lib/provisioning/dispatch-notification.ts` |
| Activación (distinto del token de compra) | `src/lib/auth/activation/*`, `/crear-contrasena` |

## Almacenamiento (hardening)

- **PK `emailNormalized`:** una identidad de invitación por correo (`Put` condicional).
- **GSI `tokenHash-index`:** lookup desde enlace sin token plano en Dynamo.
- **Reserva:** nueva referencia bloqueada si la orden previa sigue `PENDING` (evita doble checkout pagable tras expirar `reservationExpiresAt`).

## Duplicados / idempotencia hoy

- Orden: `tryMarkProvisioningProcessing` (NOT_STARTED → PROCESSING).
- SkillCert: `transactionId` en `RenaSERProvisionedOrders` → `already_provisioned`.
- Cognito: no recrea si email existe.
- Entitlement: `grantEntitlementIfAbsent`.
- Notificación: no reenvía si `notificationStatus === SENT`.
- Invitación: `markInvitationPurchasedIdempotent` solo desde CHECKOUT_STARTED + misma referencia.

## Variables operativas

| Variable | Uso |
|----------|-----|
| `RENASER_INVITATIONS_ENFORCE` | `false` desactiva gate (legacy); default enforce |
| `RENASER_INVITATION_EXPIRES_AT` | ISO8601 opcional |
| `RENASER_INVITATION_SESSION_SECRET` | firma cookie |
| `RENASER_INVITATIONS_TABLE_NAME` | default `RenaSERPurchaseInvitations` |

## Aula: sin purchase token

La invitación autoriza **comprar** en la tienda. El **activation token** del aula sigue siendo independiente post-pago.
