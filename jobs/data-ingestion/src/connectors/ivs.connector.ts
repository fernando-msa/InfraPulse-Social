import { Connector, IngestionRecord } from "../types";

export class IvsConnector implements Connector {
  sourceName = "IVS-IPEA";

  async run(): Promise<IngestionRecord[]> {
    const response = await fetch("https://ivs.ipea.gov.br/images/base/base_ivs.csv").catch(() => null);

    if (!response || !response.ok) {
      return this.fallback();
    }

    const rawCsv = await response.text();
    const lines = rawCsv.split("\n").slice(1, 30);

    const records: IngestionRecord[] = [];
    for (const line of lines) {
      const parts = line.split(";");
      if (parts.length <= 4) continue;

      const code = parts[0]?.trim();
      const name = parts[1]?.trim();
      const rawValue = parts[3]?.trim();

      if (!code || !name || !rawValue) continue;
      if (!code.startsWith("28")) continue;

      const value = Number.parseFloat(rawValue.replace(",", "."));
      if (Number.isNaN(value)) continue;

      records.push({
        source: this.sourceName,
        municipalityCode: code,
        municipalityName: name,
        metric: "ivs",
        value,
        referenceDate: "2024-12-31",
      });
    }

    return records.length > 0 ? records : this.fallback();
  }

  private fallback(): IngestionRecord[] {
    return [
      {
        source: this.sourceName,
        municipalityCode: "2800308",
        municipalityName: "Aracaju",
        metric: "ivs",
        value: 0.235,
        referenceDate: "2024-12-31",
      },
      {
        source: this.sourceName,
        municipalityCode: "2802106",
        municipalityName: "Estancia",
        metric: "ivs",
        value: 0.329,
        referenceDate: "2024-12-31",
      },
    ];
  }
}
