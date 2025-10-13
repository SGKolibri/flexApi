# --- build stage ---
FROM node:20-bullseye AS builder
WORKDIR /usr/src/app

# Copia package.json e package-lock (se houver) primeiro para cache de instalação
COPY package*.json ./
# Instala dependências (inclui devDependencies para build)
RUN npm ci

# Copia o restante do código
COPY . .

# Gera o client do Prisma (precisa do node_modules)
RUN npx prisma generate

# Build da aplicação Nest (assume que existe script "build")
RUN npm run build

# --- production stage ---
FROM node:20-slim AS runner
WORKDIR /usr/src/app

# Cria usuário não-root
RUN addgroup --system app && adduser --system --ingroup app app

# Copia arquivos necessários do builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Copia entrypoint
# COPY entrypoint.sh ./
# RUN chmod +x ./entrypoint.sh

# Usa usuário sem privilégios
USER app

ENV NODE_ENV=production
EXPOSE 3000

# entrypoint irá rodar migrações e em seguida start
# CMD ["./entrypoint.sh"]

# start padrão: usar node direto no dist
CMD ["node", "dist/src/main.js"]