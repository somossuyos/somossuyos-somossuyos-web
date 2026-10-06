# Permission set `RenaSERDeployment` — DynamoDB órdenes web

Adjuntar la policy inline o customer-managed **`scripts/aws/renaser-deployment-dynamodb-policy.json`** al permission set **RenaSERDeployment** en IAM Identity Center (cuenta `475029594948`, región `us-east-1`).

## Acciones incluidas

- `dynamodb:CreateTable`
- `dynamodb:DescribeTable`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:UpdateItem`

Recurso único:

`arn:aws:dynamodb:us-east-1:475029594948:table/SomosSuyosCheckoutOrders`

**No** incluye `ListTables`, `DeleteTable`, `Scan`, `BatchWriteItem`, ni `dynamodb:*`.

## Pasos (consola)

1. IAM Identity Center → Permission sets → **RenaSERDeployment**
2. Customer managed policies → Create policy (JSON anterior) o inline equivalente
3. **Provision** permission set → esperar **SUCCEEDED**
4. Local: `aws sso login --profile somossuyos-renaser`
5. Crear tabla:

```bash
AWS_PROFILE=somossuyos-renaser AWS_REGION=us-east-1 \
  ./scripts/aws/setup-renaser-orders.sh
```

## Runtime Amplify (web)

Policy separada (solo runtime, sin CreateTable): **`scripts/aws/amplify-runtime-dynamodb-policy.json`**

Adjuntar al rol de ejecución Lambda/SSR de la app Amplify **www.somossuyos.com** (no al permission set de desarrollo).

En consola Amplify: App → Hosting → Environment variables / Compute role (o IAM → buscar rol `amplify*` / `AmplifySSR*` asociado a la app).
