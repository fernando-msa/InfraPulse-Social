import { Injectable } from "@nestjs/common";
import { MunicipalitySnapshot } from "../types";

const initialSnapshots: MunicipalitySnapshot[] = [
  {
    municipalityCode: "2800308",
    municipalityName: "Aracaju",
    state: "SE",
    ivs: 0.235,
    cadunicoFamilies: 48210,
    bolsaFamiliaFamilies: 30640,
    suasCases: 4100,
    openJobs: 2920,
    severeFoodInsecurityRate: 0.128,
    sanitationDeficitRate: 0.21,
    healthPressureRate: 0.67,
    updatedAt: new Date().toISOString(),
  },
  {
    municipalityCode: "2802106",
    municipalityName: "Estancia",
    state: "SE",
    ivs: 0.329,
    cadunicoFamilies: 14500,
    bolsaFamiliaFamilies: 9800,
    suasCases: 1620,
    openJobs: 410,
    severeFoodInsecurityRate: 0.192,
    sanitationDeficitRate: 0.34,
    healthPressureRate: 0.58,
    updatedAt: new Date().toISOString(),
  },
  {
    municipalityCode: "2804805",
    municipalityName: "Nossa Senhora do Socorro",
    state: "SE",
    ivs: 0.301,
    cadunicoFamilies: 25870,
    bolsaFamiliaFamilies: 18040,
    suasCases: 2210,
    openJobs: 880,
    severeFoodInsecurityRate: 0.176,
    sanitationDeficitRate: 0.29,
    healthPressureRate: 0.62,
    updatedAt: new Date().toISOString(),
  },
];

@Injectable()
export class IntegrationsService {
  private cache = new Map<string, MunicipalitySnapshot>(
    initialSnapshots.map((s) => [s.municipalityCode, s]),
  );

  getAllSnapshots(): MunicipalitySnapshot[] {
    return Array.from(this.cache.values()).sort((a, b) => b.ivs - a.ivs);
  }

  getSnapshot(municipalityCode: string): MunicipalitySnapshot | undefined {
    return this.cache.get(municipalityCode);
  }

  refreshSnapshots(nextData: MunicipalitySnapshot[]): void {
    this.cache = new Map(nextData.map((row) => [row.municipalityCode, row]));
  }

  getSourceStatus(): Record<string, string> {
    return {
      ivs: "integrado (cache local)",
      cadunico: "integracao por dados consolidados",
      bolsaFamilia: "dados abertos consolidados",
      suas: "integracao prevista por convenio/API",
      sine: "integracao prevista por feed de vagas",
      sisan: "integracao prevista por rede municipal",
      snis: "integrado por indicadores publicos",
      datasus: "integrado por dataset aberto",
      eSusAps: "integracao mediante governanca LGPD e convenio",
    };
  }
}
