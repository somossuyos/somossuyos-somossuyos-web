# Camino de Santiago — WhatsApp y redes

## Enlace para redes sociales

Usar el **enlace de invitación al grupo** (`https://chat.whatsapp.com/...`) en posts de Instagram/Facebook/etc.

Configurarlo en Amplify y `.env.local`:

```bash
NEXT_PUBLIC_CAMINO_WHATSAPP_GROUP_URL=https://chat.whatsapp.com/LZtFDpH4ype95N0tt0DJ6k
```

Si no defines la variable, la web usa el mismo enlace por defecto en código (`CAMINO_WHATSAPP_GROUP_URL_DEFAULT`).

## Mensaje de bienvenida automático

WhatsApp **no** permite prellenar texto al entrar a un enlace de **grupo** desde la web. El mensaje que pidieron debe configurarse así:

1. En WhatsApp → grupo → **Descripción**: pegar el texto de bienvenida + URL del formulario (`https://www.somossuyos.com/camino-de-santiago#registro`) + fecha del webinar.
2. Si el grupo usa **mensaje de bienvenida** (cuenta Business / herramientas del grupo), pegar el mismo texto allí.

Texto de referencia (también lo genera el código en `buildCaminoWelcomeMessage()`):

> Bienvenido a la Peregrinación del Camino de Santiago y Fátima SOS!
>
> Para recibir toda la información de nuestra peregrinación, por favor diligencia el siguiente formulario: [URL]
>
> Únete a nuestro webinar informativo donde te explicaremos todo el proceso con detalle. Fecha: [fecha]

Actualizar la fecha en `content.ts` → `community.webinarDate` o variable cuando la definan.

## Web

En `/camino-de-santiago`:

- Sección **Comunidad WhatsApp** con botones de grupo y pago.
- Botón flotante verde usa el grupo Camino (no el mensaje genérico del sitio).
- Pago: `NEXT_PUBLIC_CAMINO_PAYMENT_URL` cuando exista.

## wa.me con texto prellenado

`getCaminoWhatsAppPrefillChatUrl()` sigue disponible para campañas en redes; los CTAs de la landing abren siempre el grupo.