# InfraPulse Social - Arquitetura

## Princípios

- Nao substituir sistemas governamentais existentes.
- Integrar dados publicos e institucionais por conectores.
- Separar operacao transacional (Firestore) de analise (BigQuery).
- Entregar inteligencia acionavel com explainability basica.

## Visao de Componentes

```mermaid
flowchart LR
  subgraph Fontes Publicas e Institucionais
    IVS[IVS - IPEA]
    CAD[CadUnico]
    BF[Bolsa Familia]
    SUAS[SUAS]
    SINE[SINE]
    SISAN[SISAN]
    SNIS[SNIS]
    DATASUS[DATASUS / e-SUS APS]
    PREF[APIs municipais]
  end

  subgraph Ingestao e Orquestracao
    JOB[Cloud Run Jobs / Functions\nData Ingestion]
    CACHE[(Firestore - cache operacional)]
    BQ[(BigQuery - analytics)]
  end

  subgraph Core Platform
    API[NestJS API\nInteligencia + Matching]
    AI[FastAPI\nClassificacao e Priorizacao]
  end

  subgraph Canais
    DASH[Next.js Dashboard Gov]
    PUB[API Publica opcional\nONGs e ESG]
  end

  IVS --> JOB
  CAD --> JOB
  BF --> JOB
  SUAS --> JOB
  SINE --> JOB
  SISAN --> JOB
  SNIS --> JOB
  DATASUS --> JOB
  PREF --> JOB

  JOB --> CACHE
  JOB --> BQ
  CACHE --> API
  BQ --> API
  API --> AI
  API --> DASH
  API --> PUB
```

## Fluxo de Inteligencia

```mermaid
sequenceDiagram
  participant I as Ingestion Job
  participant C as Firestore Cache
  participant A as API NestJS
  participant M as Motor de Matching
  participant R as Servico IA FastAPI
  participant D as Dashboard

  I->>C: Atualiza indicadores por municipio
  D->>A: GET /api/v1/intelligence/insights
  A->>C: Leitura de snapshots
  A->>R: POST /risk/score
  R-->>A: score + banda de risco
  A->>M: Aplicar regras de elegibilidade
  M-->>A: recomendacoes por familia
  A-->>D: KPIs + heatmap + fila priorizada
```

## Mapeamento de Integracoes Obrigatorias

- IVS (IPEA): base principal de vulnerabilidade territorial.
- CadUnico / Bolsa Familia / SUAS: elegibilidade e acompanhamento social.
- SINE / Ministerio do Trabalho: matching emprego-renda.
- SISAN + bancos municipais: seguranca alimentar.
- SNIS + APIs municipais: saneamento e infraestrutura.
- DATASUS + e-SUS APS: correlacao saude-vulnerabilidade.

## Deploy em GCP

- Backend NestJS: Cloud Run service.
- Frontend Next.js: Cloud Run service (ou Firebase Hosting + SSR).
- Jobs ETL: Cloud Run Jobs agendado por Cloud Scheduler.
- Firestore: cache operacional com TTL e versionamento de snapshot.
- BigQuery: datasets historicos para BI e auditoria.

## Escalabilidade para outros estados

- Estrategia multi-tenant por UF e municipio.
- Conectores orientados a interface para adicionar novas fontes.
- Contratos de API estaveis (versionamento em /v1, /v2).
- Governanca LGPD com minimizacao e trilha de auditoria.
