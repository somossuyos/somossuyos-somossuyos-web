#!/usr/bin/env bash
# RenaSERPurchaseInvitations — PK emailNormalized (unique), GSIs tokenHash + orderReference.
set -euo pipefail

TABLE_NAME="${RENASER_INVITATIONS_TABLE_NAME:-RenaSERPurchaseInvitations}"
REGION="${AWS_REGION:-${AWS_DEFAULT_REGION:-us-east-1}}"
DRY_RUN=false

for arg in "$@"; do
  if [[ "$arg" == "--dry-run" ]]; then DRY_RUN=true; fi
done

echo "Table: $TABLE_NAME Region: $REGION"

if $DRY_RUN; then
  echo "[dry-run] describe/create table with GSIs tokenHash-index, orderReference-index"
  exit 0
fi

if aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" >/dev/null 2>&1; then
  echo "Table exists: $TABLE_NAME"
  aws dynamodb describe-table --table-name "$TABLE_NAME" --region "$REGION" \
    --query 'Table.{Name:TableName,Status:TableStatus,GSIs:GlobalSecondaryIndexes[*].IndexName}' --output table
  exit 0
fi

aws dynamodb create-table \
  --table-name "$TABLE_NAME" \
  --attribute-definitions \
    AttributeName=tokenHash,AttributeType=S \
    AttributeName=emailNormalized,AttributeType=S \
    AttributeName=orderReference,AttributeType=S \
  --key-schema AttributeName=emailNormalized,KeyType=HASH \
  --global-secondary-indexes \
    "[{\"IndexName\":\"tokenHash-index\",\"KeySchema\":[{\"AttributeName\":\"tokenHash\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}},{\"IndexName\":\"orderReference-index\",\"KeySchema\":[{\"AttributeName\":\"orderReference\",\"KeyType\":\"HASH\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --billing-mode PAY_PER_REQUEST \
  --region "$REGION"

aws dynamodb wait table-exists --table-name "$TABLE_NAME" --region "$REGION"
echo "Done."
