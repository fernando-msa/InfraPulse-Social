export interface IngestionRecord {
  source: string;
  municipalityCode: string;
  municipalityName: string;
  metric: string;
  value: number;
  referenceDate: string;
}

export interface Connector {
  sourceName: string;
  run(): Promise<IngestionRecord[]>;
}
