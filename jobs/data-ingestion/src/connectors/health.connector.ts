import { Connector, IngestionRecord } from "../types";

export class HealthConnector implements Connector {
  sourceName = "DATASUS-eSUSAPS";

  async run(): Promise<IngestionRecord[]> {
    return [
      {
        source: this.sourceName,
        municipalityCode: "2800308",
        municipalityName: "Aracaju",
        metric: "health_pressure_rate",
        value: 0.67,
        referenceDate: "2026-03-31",
      },
    ];
  }
}
