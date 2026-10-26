# ==========================================
# Multi-stage Production Dockerfile: AgroPlant-React Frontend
# ==========================================

# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Enable legacy peer deps if needed
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY public/ ./public/
COPY src/ ./src/

# Set production API URL during build (relative / works seamlessly through Nginx proxy)
ENV REACT_APP_API_URL=""
RUN npm run build

# 2. Production Nginx Serving Stage
FROM nginx:1.25-alpine AS runner

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
