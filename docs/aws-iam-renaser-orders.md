# IAM mínimo — tabla `SomosSuyosCheckoutOrders`

Rol de ejecución SSR/Lambda de **AWS Amplify** (runtime Next.js API routes).

## Acciones permitidas

Solo sobre la tabla indicada (sustituir `ACCOUNT_ID` y `REGION`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SomosSuyosCheckoutOrdersCrud",
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/SomosSuyosCheckoutOrders"
    }
  ]
}
```

No usar `dynamodb:*`.

## Variable de entorno

`SOMOSSUYOS_ORDERS_TABLE_NAME=SomosSuyosCheckoutOrders`

Amplify/Lambda debe tener `AWS_REGION` (o `AWS_DEFAULT_REGION`) coherente con la tabla.
