# InfraPulse Social

Plataforma GovTech de inteligencia e orquestracao social para o estado de Sergipe, orientada a integracao de dados publicos e sistemas governamentais ja existentes.

## Proposta de valor

- Nao substitui CadUnico, SUAS, SINE, SISAN, SNIS, DATASUS ou e-SUS APS.
- Integra fontes existentes em uma camada unica de inteligencia acionavel.
- Gera score dinamico de vulnerabilidade, priorizacao automatica e recomendacoes de acao.

## Arquitetura da solucao

- Backend: NestJS (Cloud Run)
- Frontend: Next.js (dashboard administrativo)
- IA: FastAPI (classificacao e priorizacao)
- Dados operacionais: Firestore (cache)
- Analytics e historico: BigQuery
- ETL: Cloud Run Jobs / Cloud Functions + conectores por dominio

Documentacao detalhada em `docs/architecture.md`.

## Estrutura do repositorio

```text
apps/
  backend/                 # API principal (NestJS)
  frontend/                # Dashboard gov (Next.js)
services/
  ai-risk-fastapi/         # Motor de risco/priorizacao (FastAPI)
jobs/
  data-ingestion/          # ETL e conectores de dados publicos
packages/
  shared/                  # Contratos e utilitarios compartilhados
docs/
  architecture.md
  mvp-scope.md
```

## Integracoes obrigatorias cobertas

- Vulnerabilidade Social (base principal): IVS - IPEA ([https://ivs.ipea.gov.br](https://ivs.ipea.gov.br)); conector em `jobs/data-ingestion/src/connectors/ivs.connector.ts`.
- Programas sociais (sem recriar): CadUnico, Bolsa Familia, SUAS; conector em `jobs/data-ingestion/src/connectors/social-programs.connector.ts`.
- Emprego e renda: SINE + dados do Ministerio do Trabalho; conector em `jobs/data-ingestion/src/connectors/employment.connector.ts`.
- Seguranca alimentar: SISAN + bancos de alimentos municipais; conector em `jobs/data-ingestion/src/connectors/food-security.connector.ts`.
- Infraestrutura urbana: SNIS + APIs municipais; conector em `jobs/data-ingestion/src/connectors/urban-infra.connector.ts`.
- Saude: DATASUS + e-SUS APS; conector em `jobs/data-ingestion/src/connectors/health.connector.ts`.

## Modulos do sistema no MVP

- Modulo de Inteligencia Social
  - Endpoint: `GET /api/v1/intelligence/insights`
  - Endpoint: `GET /api/v1/intelligence/mapa-vulnerabilidade`

- Modulo de Matching Inteligente
  - Endpoint: `POST /api/v1/matching/familias`
  - Endpoint: `GET /api/v1/matching/familias/:id/recomendacoes`

- Dashboard Governamental
  - Next.js com KPIs e tabela de risco territorial

- Camada de IA
  - FastAPI `POST /risk/score`
  - FastAPI `POST /risk/prioritize`

## Como executar localmente

### Pre-requisitos

- Node.js 20+
- Python 3.11+

### 1) Instalar dependencias Node

```bash
npm install
```

### 2) Subir backend (NestJS)

```bash
npm run dev:backend
```

Backend disponivel em `http://localhost:3001/api`.

### 3) Subir frontend (Next.js)

Em outro terminal:

```bash
npm run dev:frontend
```

Frontend disponivel em `http://localhost:3000`.

### 4) Subir servico de IA (FastAPI)

```bash
cd services/ai-risk-fastapi
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Servico IA disponivel em `http://localhost:8000`.

### 5) Executar ETL de ingestao

```bash
npm run ingest
```

Snapshot gerado em `jobs/data-ingestion/cache/`.

## Endpoints principais

- `GET /api/health`
- `GET /api/v1/intelligence/insights?limit=10`
- `GET /api/v1/intelligence/mapa-vulnerabilidade`
- `POST /api/v1/matching/familias`
- `GET /api/v1/matching/familias/fam-001/recomendacoes`

## Diretrizes de produto e governanca

- Integracao first: sempre consumir fontes oficiais antes de criar novos fluxos.
- Explainability: toda recomendacao deve indicar motivo.
- Auditoria: registrar origem dos dados e carimbo temporal de cada snapshot.
- LGPD: minimizar dados pessoais e operar com controles de acesso por papel.

## Proximos passos recomendados

1. Persistencia real em Firestore e pipelines historicos em BigQuery.
2. Agendamento de ETL via Cloud Scheduler + Cloud Run Jobs.
3. Camada geoespacial com mapas de calor por bairro.
4. Filas de atendimento com SLA por secretaria e trilha de auditoria.
5. API publica opcional para ONGs e parceiros ESG.

## Changelog de Migracao

### Data

- 2026-04-20

### Escopo

- Migracao do backend de NestJS 10.x para 11.x.
- Migracao do frontend de Next.js 14.x para 16.x.
- Atualizacao de lockfile e dependencias transitivas para reduzir superficie de vulnerabilidade.

### Alteracoes tecnicas aplicadas

- Backend:
  - `@nestjs/common` atualizado para `^11.1.19`.
  - `@nestjs/core` atualizado para `^11.1.19`.
  - `@nestjs/platform-express` atualizado para `^11.1.19`.

- Frontend:
  - `next` atualizado para `^16.2.4`.
  - Ajuste em `apps/frontend/next.config.mjs` para definir `turbopack.root` no root do monorepo e evitar erro de deteccao de workspace.

### Impacto funcional observado

- Endpoints do backend permaneceram compativeis:
  - `GET /api/health`
  - `GET /api/v1/intelligence/insights`
  - `GET /api/v1/intelligence/mapa-vulnerabilidade`
  - `GET /api/v1/matching/familias/:id/recomendacoes`

- Frontend continuou carregando em `http://localhost:3000` apos ajuste do Turbopack.
- Servico FastAPI permaneceu inalterado e compativel com a stack.

### Seguranca

- Resultado final de auditoria: `npm audit --omit=dev` retornando `0 vulnerabilities`.

### Checklist de validacao executado

- [x] Subida do backend em modo desenvolvimento.
- [x] Subida do frontend em modo desenvolvimento.
- [x] Subida do servico de IA em modo desenvolvimento.
- [x] Smoke test HTTP dos endpoints principais.
- [x] Confirmacao de resposta `200` para backend, frontend e IA.
