# Use a imagem oficial do Node.js 20 Alpine (mais leve)
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache do Docker)
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copiar código da aplicação
COPY . .

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S Sudtec -u 1001

# Alterar ownership dos arquivos
RUN chown -R Sudtec:nodejs /app

# Mudar para usuário não-root
USER Sudtec

# Expor porta (ajuste se necessário)
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Comando de inicialização
CMD ["npm", "start"]