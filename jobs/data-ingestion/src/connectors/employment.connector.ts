import { Connector, IngestionRecord } from "../types";

export class EmploymentConnector implements Connector {
  sourceName = "SINE-MinisterioTrabalho";

  async run(): Promise<IngestionRecord[]> {
    return [
      {
        source: this.sourceName,
        municipalityCode: "2800308",
        municipalityName: "Aracaju",
        metric: "open_jobs",
        value: 2920,
        referenceDate: "2026-04-20",
      },
      {
        source: this.sourceName,
        municipalityCode: "2802106",
        municipalityName: "Estancia",
        metric: "open_jobs",
        value: 410,
        referenceDate: "2026-04-20",
      },
    ];
  }
}
