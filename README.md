# Todo List App

Aplicación de gestión de tareas full-stack con integración de IA para productividad inteligente.

## Tecnologías

### Backend
- **Runtime**: Bun
- **Framework**: Express.js
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: Clerk
- **IA**: Vercel AI SDK (OpenAI / Google Gemini)

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: Tailwind CSS
- **Estado**: Zustand + TanStack Query
- **Routing**: React Router DOM

### Infraestructura
- **Contenedores**: Docker + Docker Compose

## Estructura del Proyecto

```
todo-list-app/
├── packages/
│   ├── backend/          # API REST con Express
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── config/
│   │   └── Dockerfile
│   ├── frontend/         # SPA con React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── store/
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── shared/           # Tipos compartidos
│       └── src/types/
├── prisma/
│   └── schema.prisma
├── docker/
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
└── package.json
```

## Requisitos

- [Bun](https://bun.sh/) v1.1+
- [Docker](https://www.docker.com/) (opcional, para desarrollo con contenedores)
- [PostgreSQL](https://www.postgresql.org/) 16+ (o usar Docker)
- Cuenta en [Clerk](https://clerk.com/) para autenticación
- API Key de [OpenAI](https://openai.com/) o [Google AI](https://ai.google.dev/)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/todo-list-app.git
cd todo-list-app
```

### 2. Instalar dependencias

```bash
bun install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://todouser:todopass@localhost:5432/tododb"

# Clerk
CLERK_SECRET_KEY=sk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# AI Provider (openai | gemini)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
# GOOGLE_GENERATIVE_AI_API_KEY=...

# Frontend
VITE_API_URL=http://localhost:3000
```

### 4. Iniciar base de datos

**Opción A: Docker (recomendado)**
```bash
bun run docker:dev
```

**Opción B: PostgreSQL local**
```bash
createdb tododb
```

### 5. Ejecutar migraciones

```bash
bun run db:generate
bun run db:push
```

### 6. Iniciar desarrollo

```bash
bun run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Prisma Studio: `bun run db:studio`

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia frontend y backend en modo desarrollo |
| `bun run dev:frontend` | Inicia solo el frontend |
| `bun run dev:backend` | Inicia solo el backend |
| `bun run build` | Compila el frontend para producción |
| `bun run db:generate` | Genera el cliente de Prisma |
| `bun run db:migrate` | Ejecuta migraciones de base de datos |
| `bun run db:push` | Sincroniza el schema con la base de datos |
| `bun run db:studio` | Abre Prisma Studio |
| `bun run docker:dev` | Inicia PostgreSQL en Docker |
| `bun run docker:prod` | Inicia todos los servicios en Docker |
| `bun run docker:down` | Detiene los contenedores Docker |

## Funcionalidades de IA

La aplicación integra capacidades de IA para mejorar la productividad:

### 1. Resumen Inteligente
Genera un resumen de todas las tareas pendientes con tiempo estimado de completación.

```
Botón: "AI Summary"
Endpoint: POST /api/ai/summary
```

### 2. Sugerencia de Prioridades
Analiza las tareas y sugiere prioridades (LOW, MEDIUM, HIGH, URGENT) basándose en:
- Indicadores de urgencia en el título/descripción
- Dependencias o bloqueos mencionados
- Impacto en el negocio

```
Botón: "AI Priorities"
Endpoint: POST /api/ai/priorities
```

### 3. Auto-completar Descripción
Genera automáticamente una descripción detallada basándose en el título de la tarea.

```
Botón: "AI Complete" (en el formulario de tarea)
Endpoint: POST /api/ai/complete-description
```

### Cambiar Proveedor de IA

Editar `AI_PROVIDER` en `.env`:

```env
# Usar OpenAI (gpt-4o-mini)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Usar Google Gemini (gemini-2.0-flash)
AI_PROVIDER=gemini
GOOGLE_GENERATIVE_AI_API_KEY=...
```

## API Endpoints

### Autenticación
Todas las rutas `/api/*` requieren autenticación via Clerk.

### Tareas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Listar tareas (con filtros y paginación) |
| GET | `/api/tasks/:id` | Obtener una tarea |
| POST | `/api/tasks` | Crear tarea |
| PATCH | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea (soft delete) |
| POST | `/api/tasks/:id/restore` | Restaurar tarea eliminada |

### IA

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/ai/summary` | Generar resumen de tareas |
| POST | `/api/ai/priorities` | Sugerir prioridades |
| POST | `/api/ai/complete-description` | Auto-completar descripción |

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Estado del servidor |

## Desarrollo

### Estructura de una Tarea

```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  aiPriority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Agregar Nuevo Endpoint

1. Definir tipos en `packages/shared/src/types/`
2. Crear servicio en `packages/backend/src/services/`
3. Crear controlador en `packages/backend/src/controllers/`
4. Agregar ruta en `packages/backend/src/routes/`
5. Consumir desde frontend en `packages/frontend/src/services/`

## Licencia

MIT
