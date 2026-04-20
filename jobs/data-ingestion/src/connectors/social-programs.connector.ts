import { Connector, IngestionRecord } from "../types";

export class SocialProgramsConnector implements Connector {
  sourceName = "CadUnico-BolsaFamilia-SUAS";

  async run(): Promise<IngestionRecord[]> {
    // Integra com dados existentes. Nao substitui os sistemas originais.
    return [
      {
        source: this.sourceName,
        municipalityCode: "2800308",
        municipalityName: "Aracaju",
        metric: "cadunico_families",
        value: 48210,
        referenceDate: "2025-12-31",
      },
      {
        source: this.sourceName,
        municipalityCode: "2800308",
        municipalityName: "Aracaju",
        metric: "bolsa_familia_families",
        value: 30640,
        referenceDate: "2025-12-31",
      },
      {
        source: this.sourceName,
        municipalityCode: "2802106",
        municipalityName: "Estancia",
        metric: "suas_cases",
        value: 1620,
        referenceDate: "2025-12-31",
      },
    ];
  }
}
