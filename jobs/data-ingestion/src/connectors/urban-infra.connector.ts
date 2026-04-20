import { Connector, IngestionRecord } from "../types";

export class UrbanInfraConnector implements Connector {
  sourceName = "SNIS-Prefeituras";

  async run(): Promise<IngestionRecord[]> {
    return [
      {
        source: this.sourceName,
        municipalityCode: "2802106",
        municipalityName: "Estancia",
        metric: "sanitation_deficit_rate",
        value: 0.34,
        referenceDate: "2025-12-31",
      },
    ];
  }
}
