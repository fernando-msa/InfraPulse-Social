import { Injectable } from "@nestjs/common";
import { IntegrationsService } from "../sources/integrations.service";

@Injectable()
export class IntelligenceService {
  constructor(private readonly integrationsService: IntegrationsService) {}

  getMunicipalityInsights(limit = 20) {
    return this.integrationsService
      .getAllSnapshots()
      .slice(0, limit)
      .map((item) => {
        const socialRiskScore = this.computeRisk(item);
        const topSignals = this.extractSignals(item);
        return {
          municipalityCode: item.municipalityCode,
          municipalityName: item.municipalityName,
          socialRiskScore,
          topSignals,
          updatedAt: item.updatedAt,
        };
      });
  }

  private computeRisk(item: {
    ivs: number;
    severeFoodInsecurityRate: number;
    sanitationDeficitRate: number;
    healthPressureRate: number;
    openJobs: number;
  }): number {
    const jobProtection = Math.max(0, 1 - item.openJobs / 4000);
    const rawScore =
      item.ivs * 0.35 +
      item.severeFoodInsecurityRate * 0.25 +
      item.sanitationDeficitRate * 0.15 +
      item.healthPressureRate * 0.2 +
      jobProtection * 0.05;

    return Math.round(rawScore * 1000) / 1000;
  }

  private extractSignals(item: {
    severeFoodInsecurityRate: number;
    sanitationDeficitRate: number;
    healthPressureRate: number;
    openJobs: number;
  }): string[] {
    const signals: string[] = [];

    if (item.severeFoodInsecurityRate > 0.16) {
      signals.push("Inseguranca alimentar elevada");
    }
    if (item.sanitationDeficitRate > 0.28) {
      signals.push("Deficit de saneamento relevante");
    }
    if (item.healthPressureRate > 0.6) {
      signals.push("Alta pressao na rede de saude");
    }
    if (item.openJobs < 700) {
      signals.push("Baixa oferta de vagas formais");
    }

    return signals.length > 0 ? signals : ["Sem alerta critico no momento"];
  }
}
