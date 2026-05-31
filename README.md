<div align="center">

# InfraPulse Social

**Plataforma GovTech de Inteligência e Orquestração Social**

![NestJS](https://img.shields.io/badge/NestJS-11.x-e0234e?style=flat-square&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.x-000000?style=flat-square&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Introdução](#introdução) · [Arquitetura](#arquitetura) · [Stack](#stack) · [Como Rodar](#como-rodar) · [API](#api) · [Testes](#testes)

</div>

---

## Introdução

O InfraPulse Social é uma plataforma GovTech que integra dados públicos e sistemas governamentais existentes em uma camada única de inteligência acionável para o estado de Sergipe.

**Princípio central:** não substitui sistemas como CadUnico, SUAS, SINE, SISAN, SNIS, DATASUS ou e-SUS APS — eles são integrados por conectores especializados.

A plataforma gera um **score dinâmico de vulnerabilidade social** por município, prioriza famílias em situação de risco e recomenda programas sociais com base em dados reais.

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Fontes de Dados Públicas                   │
│  IVS/IPEA · CadÚnico · Bolsa Família · SUAS · SINE · SISAN    │
│  SNIS · DATASUS · e-SUS APS · APIs Municipais                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   Data Ingestion    │
                    │   (Cloud Run Jobs)  │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Firestore (cache)  │
                    │  BigQuery (histórico)│
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼─────────┐  ┌──▼───────────┐  ┌─▼──────────────┐
    │   NestJS API      │  │  FastAPI      │  │  Next.js       │
    │  Inteligência +   │  │  Risk Score   │  │  Dashboard     │
    │  Matching         │  │  Priorização  │  │  Governamental │
    └───────────────────┘  └──────────────┘  └────────────────┘
```

Documentação detalhada em [`docs/architecture.md`](docs/architecture.md).

---

## Stack

| Camada       | Tecnologia        | Propósito                                      |
|-------------|-------------------|------------------------------------------------|
| **Backend** | NestJS 11.x       | API REST com inteligência social e matching     |
| **Frontend**| Next.js 16.x      | Dashboard governamental com KPIs e mapa de risco|
| **IA**      | FastAPI 0.115      | Score de risco e priorização de atendimento     |
| **ETL**     | Node.js + TS       | Conectores de dados públicos por domínio        |
| **Shared**  | TypeScript         | Contratos e utilitários compartilhados          |
| **Validação**| class-validator   | Input validation com DTOs tipados               |
| **Testes**  | Jest + Supertest   | Testes unitários e end-to-end                   |

---

## Estrutura do Repositório

```
infrapulse-social/
├── apps/
│   ├── backend/                  # API principal (NestJS)
│   │   └── src/modules/
│   │       ├── intelligence/     # Insights e mapa de vulnerabilidade
│   │       ├── matching/         # Recomendação de programas por família
│   │       └── sources/          # Serviço de integrações e cache
│   └── frontend/                 # Dashboard (Next.js App Router)
├── services/
│   └── ai-risk-fastapi/          # Motor de risco e priorização
├── jobs/
│   └── data-ingestion/           # ETL com conectores por domínio
│       └── src/connectors/
│           ├── ivs.connector.ts
│           ├── social-programs.connector.ts
│           ├── employment.connector.ts
│           ├── food-security.connector.ts
│           ├── urban-infra.connector.ts
│           └── health.connector.ts
├── packages/
│   └── shared/                   # Tipos e cálculo de risco compartilhado
└── docs/
    ├── architecture.md
    └── mvp-scope.md
```

---

## Como Rodar

### Pré-requisitos

- Node.js 20+
- Python 3.11+

### 1. Instalar dependências

```bash
npm install
```

### 2. Backend (NestJS)

```bash
npm run dev:backend
# → http://localhost:3001/api
```

### 3. Frontend (Next.js)

```bash
npm run dev:frontend
# → http://localhost:3000
```

### 4. Serviço de IA (FastAPI)

```bash
cd services/ai-risk-fastapi
python -m venv .venv
. .venv/Scripts/activate   # Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
# → http://localhost:8000
```

### 5. ETL de ingestão

```bash
npm run ingest
```

---

## API

### Endpoints Principais

| Método | Rota                                           | Descrição                           |
|--------|------------------------------------------------|-------------------------------------|
| GET    | `/api/health`                                  | Health check                        |
| GET    | `/api/v1/intelligence/insights?limit=10`       | Insights por município              |
| GET    | `/api/v1/intelligence/mapa-vulnerabilidade`    | Mapa de vulnerabilidade do estado   |
| POST   | `/api/v1/matching/familias`                    | Criar/atualizar perfil de família   |
| GET    | `/api/v1/matching/familias/:id/recomendacoes`  | Recomendações de programas sociais  |
| POST   | `/risk/score`                                  | Score de risco (FastAPI)            |
| POST   | `/risk/prioritize`                             | Priorização de atendimento (FastAPI)|

### Exemplo de resposta — `/api/v1/intelligence/insights`

```json
{
  "items": [
    {
      "municipalityCode": "2802106",
      "municipalityName": "Estância",
      "socialRiskScore": 0.334,
      "topSignals": [
        "Insegurança alimentar elevada",
        "Déficit de saneamento relevante",
        "Baixa oferta de vagas formais"
      ],
      "updatedAt": "2026-04-20T19:35:00.000Z"
    }
  ],
  "sourceStatus": {
    "ivs": "integrado (cache local)",
    "cadunico": "integração por dados consolidados"
  },
  "generatedAt": "2026-04-20T19:35:00.000Z"
}
```

---

## Integrações Cobertas

| Fonte               | Domínio                      | Status                   |
|---------------------|------------------------------|--------------------------|
| IVS (IPEA)          | Vulnerabilidade territorial  | Integrado (conector)     |
| CadÚnico            | Programas sociais            | Dados consolidados       |
| Bolsa Família       | Transferência de renda       | Dados consolidados       |
| SUAS                | Assistência social           | Integração prevista      |
| SINE                | Emprego e renda              | Integração prevista      |
| SISAN               | Segurança alimentar          | Integração prevista      |
| SNIS                | Infraestrutura urbana        | Integrado (indicadores)  |
| DATASUS / e-SUS APS | Saúde                        | Integrado (dataset aberto)|

---

## Testes

```bash
# Testes unitários
npm run test

# Testes com cobertura
npm run test:cov

# Testes end-to-end
npm run test:e2e
```

**Cobertura de testes:**
- IntelligenceService: insights, cálculo de risco, extração de sinais
- MatchingService: CRUD de famírias, recomendações, tratamento de erros
- IntegrationsService: snapshots, refresh, status de fontes
- E2E: health check, insights, matching, validação de input

---

## Segurança

- CORS configurado com origem restrita (não `*`)
- Input validation com `class-validator` e DTOs tipados
- `forbidNonWhitelisted` ativo — campos extras são rejeitados
- Validação de parâmetros com bounds (limit: 1-200)
- Sanitização de inputs no conector IVS (CSV parser com validação)
- Sem dados sensíveis hardcoded no repositório
- `.env` no `.gitignore`

---

## Próximos Passos

1. Persistência real em Firestore e pipelines históricos em BigQuery
2. Autenticação institucional (Gov.br / OAuth 2.0)
3. Agendamento de ETL via Cloud Scheduler + Cloud Run Jobs
4. Camada geoespacial com mapas de calor por bairro
5. Filas de atendimento com SLA por secretaria e trilha de auditoria
6. API pública para ONGs e parceiros ESG

---

## Licença

MIT © [Fernando S. De Santana Júnior](LICENSE)
