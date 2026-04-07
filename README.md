# OpenJud - Pesquisa de Processos Judiciais 📜

Uma aplicação web moderna para pesquisa e visualização de processos judiciais da base de dados pública do DataJud do Conselho Nacional de Justiça (CNJ).

![Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![Docker](https://img.shields.io/badge/docker-%3E%3D20.10-blue)

## ✨ Características

- **Design Moderno**: Tema claro/escuro com transições suaves, inspirado no estilo Claude
- **Animações Elegantes**: Transições fluidas e interações responsivas
- **Pesquisa Avançada**: Filtre por número do processo, tribunal, classe processual e assunto
- **Visualização Detalhada**: Informações completas do processo com histórico de movimentações
- **Timeline Interativa**: Acompanhe a progressão do processo no tempo
- **Suporte Multi-Tribunal**: Integrated with all Brazilian courts
- **Fully Typed**: TypeScript em frontend e backend

## ⚡ Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| **Frontend** | Vue 3 + TypeScript + Vite | 3.3.11 |
| **Backend** | Node.js + Express + TypeScript | Node 18+ |
| **Styling** | CSS 3 com Dark/Light Themes | - |
| **State Management** | Pinia | 2.1.6 |
| **HTTP Client** | Axios | 1.6.2 |
| **Deploy** | Docker Compose | v2.0+ |
| **Reverse Proxy** | Nginx | Alpine |

## 📋 Requisitos

- **Node.js**: >= 18.0.0
- **Docker**: >= 20.10.0
- **Docker Compose**: >= 2.0.0
- **npm** ou **yarn**

## 🚀 Quick Start

### Com Docker Compose (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/rafaelschuh/openJud.git
cd openJud

# Inicie a aplicação
docker compose up -d

# Acesse
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

### Desenvolvimento Local

```bash
# Backend
cd backend
npm install
npm run dev  # http://localhost:3001

# Em outro terminal - Frontend
cd frontend
npm install
npm run dev  # http://localhost:5173
```

### Scripts Auxiliares

```bash
# Iniciar desenvolvimento
./dev.sh

# Build para produção
./build.sh latest

# Deploy em produção
./deploy.sh rafaelschuh latest
```

## 📖 Documentação

- [DEPLOY.md](./DEPLOY.md) - Guia completo de deployment
- [API Endpoints](#api-endpoints) - Referência de endpoints
- [Estrutura do Projeto](#estrutura-do-projeto) - Arquitetura

## 🔧 Instalação

## 📋 Variáveis de Ambiente

### Backend (.env)
```env
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
DATAJUD_API_BASE_URL=https://api-publica.datajud.cnj.jus.br/
DATAJUD_API_TIMEOUT=30000
CORS_ORIGIN=*
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_API_TIMEOUT=30000
```

## Estrutura do Projeto

```
openJud/
├── backend/              # Server Node.js + TypeScript
│   ├── src/
│   │   ├── index.ts      # Entry point
│   │   ├── server.ts     # Express setup
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # DataJud integration
│   │   ├── types/        # TypeScript interfaces
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utilities
│   ├── Dockerfile
│   └── package.json
│
├── frontend/             # Vue.js + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page components
│   │   ├── composables/  # Vue composables
│   │   ├── stores/       # Pinia stores
│   │   ├── styles/       # Global styles & animations
│   │   ├── types/        # API types
│   │   ├── router/       # Vue Router config
│   │   ├── main.ts       # Entry point
│   │   └── App.vue       # Root component
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Verifica se a aplicação está rodando

### Processos
- `GET /api/processes/search?numeroProcesso=...&tribunal=...` - Pesquisa de processos
  - Query params: `numeroProcesso`, `tribunal`, `classe`, `assunto`, `page`, `limit`
  - Response: `{ success: boolean, data: Processo[] }`

- `GET /api/processes/:id` - Detalhes de um processo específico
  - Response: `{ success: boolean, data: Processo }`

### Response Format
```json
{
  "success": true,
  "data": {
    "id": "string",
    "tribunal": "string",
    "numeroProcesso": "string",
    "dataAjuizamento": "ISO8601",
    "grau": "string",
    "classe": { "codigo": number, "nome": string },
    "assuntos": [{ "codigo": number, "nome": string }],
    "orgaoJulgador": { "codigo": number, "nome": string },
    "movimentos": [{ "codigo": number, "nome": string, "dataHora": "ISO8601" }]
  }
}
```

## 🛠️ Build

### Build Final

```bash
# Backend
cd backend
npm run build
# Gera: backend/dist/

# Frontend
cd frontend
npm run build
# Gera: frontend/dist/
```

### Type Checking

```bash
# Backend
cd backend
npm run typecheck

# Frontend
cd frontend
npm run type-check
```

## 🚢 Deploy

### Docker Compose (Local)

```bash
# Com build automático
docker compose up --build

# Apenas iniciar (imagens já existem)
docker compose up -d

# Ver logs
docker compose logs -f

# Parar
docker compose down
```

### Production (Docker Registry)

Veja [DEPLOY.md](./DEPLOY.md) para instruções detalhadas:

```bash
# Build e push
./build.sh v1.0.0

# Deploy
./deploy.sh rafaelschuh v1.0.0
```

## 📁 Estrutura do Projeto

```
openJud/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── server.ts          # Express setup
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── middleware/        # Express middleware
│   │   └── utils/             # Utilities
│   ├── Dockerfile
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                   # Vue.js + TypeScript + Vite
│   ├── src/
│   │   ├── main.ts            # Entry point
│   │   ├── App.vue            # Root component
│   │   ├── components/        # Vue components
│   │   ├── views/             # Page views
│   │   ├── stores/            # Pinia stores
│   │   ├── composables/       # Vue composables
│   │   ├── styles/            # Global styles
│   │   ├── types/             # API types
│   │   └── router/            # Vue Router
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.ts
│   └── package.json
│
├── docker-compose.yml
├── build.sh                   # Build script
├── deploy.sh                  # Deploy script
├── dev.sh                     # Development script
├── DEPLOY.md                  # Deployment guide
├── README.md                  # This file
└── .gitignore
```

## 🎨 Tema Visual

### Paleta de Cores

**Light Mode**
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Primary Text: `#1A1A1A`
- Accent: `#6366F1` (Indigo)
- Border: `#E5E7EB`

**Dark Mode**
- Background: `#0F0F0F`
- Surface: `#1A1A1A`
- Primary Text: `#FFFFFF`
- Accent: `#818CF8` (Indigo claro)
- Border: `#3F3F3F`

### Componentes

- **Header**: Navbar responsiva com toggle de tema
- **SearchForm**: Formulário com múltiplos filtros
- **ProcessCard**: Card compacto com resumo do processo
- **ProcessDetails**: Página detalhada com todas as informações
- **MovementTimeline**: Timeline visual dos movimentos processuais
- **LoadingSpinner**: Animação de carregamento

## 🔄 Estado da Aplicação (Pinia)

```typescript
// Stores disponíveis
useThemeStore()      // Tema light/dark
useProcessStore()    // Dados do processo atual
```

## 📚 Documentação DataJud

- [Glossário de Dados](https://datajud-wiki.cnj.jus.br/api-publica/glossario)
- [Endpoints](https://datajud-wiki.cnj.jus.br/api-publica/endpoints)
- [Exemplos](https://datajud-wiki.cnj.jus.br/api-publica/exemplos)
- [Termos de Uso](https://datajud-wiki.cnj.jus.br/api-publica/termo-uso)

## 📄 License

MIT © 2026 Rafael Schuh

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

### Documentação
- [DEPLOY.md](./DEPLOY.md) - Guia de deployment e troubleshooting
- [DataJud Wiki](https://datajud-wiki.cnj.jus.br/api-publica)

### Reportar Problemas

Abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Logs relevantes
- Seu ambiente (SO, Docker version, etc)

### Contato

Para questões e sugestões:
- GitHub Issues: [Abra uma issue](../issues)
- Email: rafael@example.com

## 🙏 Agradecimentos

- [CNJ - Conselho Nacional de Justiça](https://www.cnj.jus.br/) pela API DataJud
- [Vue.js](https://vuejs.org/) pela excelente framework
- [Express.js](https://expressjs.com/) pelo web framework robusto

## 📊 Status do Projeto

| Componente | Status | Notas |
|-----------|--------|-------|
| Backend | ✅ Completo | Pronto para produção |
| Frontend | ✅ Completo | Responsive e otimizado |
| Docker | ✅ Completo | Multi-stage builds |
| Tests | 🚧 Em desenvolvimento | Cobertura prioritária |
| Docs | ✅ Completo | Deployment guide incluído |

## 🗺️ Roadmap

- [ ] Testes unitários (frontend e backend)
- [ ] E2E tests
- [ ] API caching com Redis
- [ ] Favoritos/Bookmarks
- [ ] Compartilhamento de processos
- [ ] Exportar para PDF
- [ ] Analytics integrado
- [ ] Notificações via email
- [ ] Integração com sistemas externos

## 📈 Métricas

- Frontend Bundle Size: ~165 KB (gzipped: ~57 KB)
- Backend Size: ~300 MB (Docker image)
- API Response Time: < 500ms (DataJud)
- Uptime Target: 99.9%

---

**OpenJud** - Transparência e Acesso à Justiça 🏛️

<sub>*Desenvolvido totalmente com assistência de IA (Claude)*</sub>
