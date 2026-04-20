import { Connector, IngestionRecord } from "../types";

export class FoodSecurityConnector implements Connector {
  sourceName = "SISAN-BancosAlimentos";

  async run(): Promise<IngestionRecord[]> {
    return [
      {
        source: this.sourceName,
        municipalityCode: "2804805",
        municipalityName: "Nossa Senhora do Socorro",
        metric: "severe_food_insecurity_rate",
        value: 0.176,
        referenceDate: "2026-03-31",
      },
    ];
  }
}
