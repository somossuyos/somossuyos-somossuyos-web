#!/usr/bin/env bash
# Crea o describe la tabla DynamoDB SomosSuyosCheckoutOrders (PAY_PER_REQUEST, PK reference).
# Uso: ./scripts/aws/setup-renaser-orders.sh [--dry-run]
set -euo pipefail

TABLE_NAME="${SOMOSSUYOS_ORDERS_TABLE_NAME:-SomosSuyosCheckoutOrders}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"
DRY_RUN=false

for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then
    DRY_RUN=true
  fi
done

echo "Table: $TABLE_NAME"
echo "Region: $REGION"
echo "Billing: PAY_PER_REQUEST"
echo "PK: reference (String)"

if $DRY_RUN; then
  echo "[dry-run] Would run: aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION"
  echo "[dry-run] If missing, would run: aws dynamodb create-table ..."
  exit 0
fi

if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "Table already exists: $TABLE_NAME"
  aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" --query 'Table.{Name:TableName,Status:TableStatus,ItemCount:ItemCount}' --output table
  exit 0
fi

echo "Creating table $TABLE_NAME ..."
aws dynamodb create-table \
  --table-name "$TABLE_NAME" \
  --attribute-definitions AttributeName=reference,AttributeType=S \
  --key-schema AttributeName=reference,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

echo "Waiting for table to become ACTIVE ..."
aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$REGION"
echo "Done."
