#!/usr/bin/env bash
set -e

# Tempo máximo para aguardar DB, em segundos
MAX_ATTEMPTS=30
SLEEP_TIME=2

echo "Aguardando o PostgreSQL..."

attempt=0
until psql "$DATABASE_URL" -c '\q' 2>/dev/null; do
  attempt=$((attempt+1))
  if [ $attempt -ge $MAX_ATTEMPTS ]; then
    echo "Postgres não ficou disponível após $((MAX_ATTEMPTS * SLEEP_TIME))s. Abortando."
    exit 1
  fi
  sleep $SLEEP_TIME
done

echo "Postgres disponível. Rodando migrations Prisma..."
# Garante que o prisma esteja no PATH do projeto (usa npx)
npx prisma migrate deploy

echo "Iniciando aplicação..."
# Inicia a aplicação em modo produção (script start:prod deverá existir)
npm run start:prod
