# Use imagem oficial Node.js 20 com Alpine
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./

# Variável para evitar warnings durante build
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max_old_space_size=512 --trace-warnings"

# Instalar apenas dependências de produção
RUN npm ci --omit=dev && npm cache clean --force

# Copiar restante do código
COPY . .

# Criar usuário não-root e alterar permissões
RUN addgroup -g 1001 -S nodejs && \
    adduser -S Sudtec -u 1001 && \
    chown -R Sudtec:nodejs /app

# Mudar para usuário seguro
USER Sudtec

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"]
