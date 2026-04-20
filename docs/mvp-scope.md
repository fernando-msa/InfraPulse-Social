# Escopo do MVP

## Incluido

- API NestJS com:
  - endpoint de inteligencia social por municipio
  - endpoint de mapa de vulnerabilidade
  - endpoint de matching por familia
- Dashboard Next.js com KPIs e tabela de risco
- Servico FastAPI para score e priorizacao
- ETL inicial com conector IVS (obrigatorio) + conectores base dos demais dominios

## Fora do MVP (proxima fase)

- Auth institucional (Gov.br/OAuth)
- Mapa geoespacial com camadas GIS completas
- Notificacoes omnichannel (WhatsApp/SMS)
- Treinamento de modelo ML supervisionado

## Criterios de aceite

- Nao recriar sistemas governamentais existentes
- Integrar dados publicos por conectores e cache local
- Exibir score de risco e recomendacoes por familia
- Estrutura preparada para Cloud Run + Firestore + BigQuery
