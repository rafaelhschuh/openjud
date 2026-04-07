# 🚀 Deploy OpenJud - Guia Completo

## Índice
1. [Deploy Local com Docker Compose](#deploy-local)
2. [Deploy em Produção](#deploy-produção)
3. [Push para Docker Registry](#push-registry)
4. [Configurações de Ambiente](#ambiente)
5. [Troubleshooting](#troubleshooting)

---

## Deploy Local

### Pré-requisitos
- Docker >= 20.10.0
- Docker Compose >= 2.0.0
- Git

### Iniciar Aplicação

```bash
# Clone o repositório
git clone <seu-repo>
cd openJud

# Inicie os containers
docker compose up -d

# Verifique o status
docker compose ps

# Acompanhe os logs
docker compose logs -f
```

**Acesso:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health Check: http://localhost:3001/api/health

### Parar Aplicação

```bash
docker compose down

# Para remover volumes também
docker compose down -v
```

---

## Desenvolvimento Local

### Quick Start

```bash
# Make scripts executable
chmod +x dev.sh build.sh deploy.sh

# Start development environment
./dev.sh
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
# Roda em http://localhost:3001
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# Roda em http://localhost:5173
```

### Build para Produção

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## Deploy em Produção

### 1. Build das Imagens

```bash
# Executar script de build
./build.sh latest

# Ou build manual
docker build -t rafaelschuh/openjud-backend:latest ./backend
docker build -f ./frontend/Dockerfile -t rafaelschuh/openjud-frontend:latest ./frontend
```

### 2. Push para Docker Registry

```bash
# Login no Docker Hub
docker login

# Push das imagens
docker push rafaelschuh/openjud-backend:latest
docker push rafaelschuh/openjud-frontend:latest

# Com versão específica
docker tag rafaelschuh/openjud-backend:latest rafaelschuh/openjud-backend:v1.0.0
docker push rafaelschuh/openjud-backend:v1.0.0
```

### 3. Deploy na Infraestrutura

**Local (usando imagens do registry):**
```bash
./deploy.sh rafaelschuh latest
```

**Remote Server:**
```bash
# SSH no servidor
ssh user@server

# Clone o repo
git clone <seu-repo>
cd openJud

# Faça pull das imagens
docker pull rafaelschuh/openjud-backend:latest
docker pull rafaelschuh/openjud-frontend:latest

# Use o docker-compose
docker compose -f docker-compose.prod.yml up -d
```

---

## Configurações de Ambiente

### Backend (.env)

```env
# Ambiente
NODE_ENV=production
PORT=3001
LOG_LEVEL=info

# DataJud API
DATAJUD_API_BASE_URL=https://api-publica.datajud.cnj.jus.br/
DATAJUD_API_TIMEOUT=30000

# CORS
CORS_ORIGIN=*
```

### Frontend (.env)

```env
# API Backend
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

### Docker Compose (variáveis)

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - LOG_LEVEL=info
  - DATAJUD_API_BASE_URL=https://api-publica.datajud.cnj.jus.br/
  - DATAJUD_API_TIMEOUT=30000
  - CORS_ORIGIN=*
  - VITE_API_URL=http://backend:3001
```

---

## Health Checks

### Verificar Status

```bash
# Backend health
curl http://localhost:3001/api/health

# Esperado:
# {"success":true,"message":"OpenJud Backend is running","timestamp":"..."}

# Frontend (index)
curl http://localhost:5173

# Docker compose
docker compose ps
```

### Logs

```bash
# Ver logs de um serviço
docker compose logs backend
docker compose logs frontend

# Follow logs
docker compose logs -f backend

# Últimas N linhas
docker compose logs --tail=50 backend
```

---

## Upgrades e Atualizações

### Atualizar para Nova Versão

```bash
# 1. Build nova versão
./build.sh v1.1.0

# 2. Push para registry
docker push rafaelschuh/openjud-backend:v1.1.0
docker push rafaelschuh/openjud-frontend:v1.1.0

# 3. Atualizar docker-compose.yml ou .env
# Mudar VERSION=v1.1.0

# 4. Fazer pull das novas imagens
docker compose pull

# 5. Reiniciar containers
docker compose up -d
```

### Zero-Downtime Deploy (com load balancer)

```bash
# 1. Pull nova versão
docker pull rafaelschuh/openjud-backend:v1.1.0
docker pull rafaelschuh/openjud-frontend:v1.1.0

# 2. Iniciar novos containers com nova tag
docker compose -f docker-compose.new.yml up -d

# 3. Testar nova versão
curl http://localhost:3002/api/health

# 4. Switch de tráfego no load balancer

# 5. Remover containers antigos
docker compose -f docker-compose.old.yml down
```

---

## Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker compose logs backend
docker compose logs frontend

# Verificar se porta está em uso
netstat -tlnp | grep 3001
netstat -tlnp | grep 5173

# Liberar porta (Linux)
sudo lsof -i :3001
sudo kill -9 <PID>
```

### Frontend não acessa backend

```bash
# Verificar conectividade da rede docker
docker compose exec frontend curl http://backend:3001/api/health

# Verificar CORS
curl -H "Origin: http://localhost:5173" http://localhost:3001/api/health
```

### API DataJud não responde

```bash
# Testar conectividade
docker compose exec backend curl https://api-publica.datajud.cnj.jus.br/

# Verificar logs
docker compose logs backend | grep Error
```

### Limpeza completa

```bash
# Remover containers, volumes e networks
docker compose down -v

# Remover imagens
docker rmi rafaelschuh/openjud-backend:latest
docker rmi rafaelschuh/openjud-frontend:latest

# Limpar dangling images
docker image prune

# Reiniciar do zero
docker compose up -d --build
```

---

## Performance e Otimizações

### Aumentar recursos

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '1'
          memory: 512M
```

### Caching

```yaml
services:
  frontend:
    build:
      cache_from:
        - openjud-frontend:latest
```

### Multi-stage Build

- ✅ Já implementado nos Dockerfiles
- Reduz tamanho final das imagens
- Frontend: ~20 MB (nginx)
- Backend: ~300 MB (node)

---

## Monitoramento

### Métricas Docker

```bash
# CPU e memória
docker stats

# Eventos
docker events

# Inspeção de container
docker inspect openjud-backend
```

### Logs Estruturados

Backend usa logs estruturados com timestamp:
```
[TIMESTAMP] [LEVEL] Mensagem
[2026-04-07T14:02:16.466Z] [INFO] 🚀 Server running on http://0.0.0.0:3001
```

---

## Backup e Disaster Recovery

```bash
# Backup de imagens
docker save rafaelschuh/openjud-backend:latest -o backup-backend.tar
docker save rafaelschuh/openjud-frontend:latest -o backup-frontend.tar

# Restaurar imagens
docker load -i backup-backend.tar
docker load -i backup-frontend.tar

# Backup de volumes (se houver)
docker run --rm -v openjud_data:/data -v $(pwd):/backup \
  ubuntu tar czf /backup/data-backup.tar.gz -C /data .
```

---

## Referências

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [DataJud API Documentation](https://datajud-wiki.cnj.jus.br/api-publica)

---

## Suporte

Para problemas ou questões:
1. Verifique os logs: `docker compose logs`
2. Validar configurações de ambiente
3. Testar conectividade com a API DataJud
4. Consultar documentação oficial
