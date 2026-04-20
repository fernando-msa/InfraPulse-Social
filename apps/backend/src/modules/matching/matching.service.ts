import { Injectable, NotFoundException } from "@nestjs/common";
import { IntegrationsService } from "../sources/integrations.service";
import { FamilyProfile, MatchingRecommendation } from "../types";

@Injectable()
export class MatchingService {
  private readonly families = new Map<string, FamilyProfile>([
    [
      "fam-001",
      {
        id: "fam-001",
        municipalityCode: "2802106",
        members: 5,
        incomePerCapita: 180,
        hasChildren: true,
        hasUnemployedAdults: true,
        foodInsecurityReported: true,
      },
    ],
  ]);

  constructor(private readonly integrationsService: IntegrationsService) {}

  upsertFamily(payload: FamilyProfile): FamilyProfile {
    this.families.set(payload.id, payload);
    return payload;
  }

  recommendForFamily(id: string): {
    family: FamilyProfile;
    municipalityRisk: number;
    recommendations: MatchingRecommendation[];
  } {
    const family = this.families.get(id);
    if (!family) {
      throw new NotFoundException(`Familia ${id} nao encontrada`);
    }

    const municipality = this.integrationsService.getSnapshot(family.municipalityCode);
    const municipalityRisk = municipality ? municipality.ivs : 0.3;
    const recommendations: MatchingRecommendation[] = [];

    if (family.incomePerCapita <= 218) {
      recommendations.push({
        program: "Bolsa Familia",
        reason: "Renda per capita abaixo do limiar de elegibilidade",
        priority: "alta",
      });
    }

    if (family.hasChildren) {
      recommendations.push({
        program: "Acompanhamento CRAS/SUAS",
        reason: "Nucleo familiar com criancas e necessidade de acompanhamento",
        priority: "media",
      });
    }

    if (family.hasUnemployedAdults) {
      recommendations.push({
        program: "Intermediacao de vagas SINE",
        reason: "Adultos sem emprego formal no cadastro",
        priority: "media",
      });
    }

    if (family.foodInsecurityReported) {
      recommendations.push({
        program: "Rede SISAN e banco de alimentos",
        reason: "Registro de inseguranca alimentar",
        priority: "alta",
      });
    }

    return { family, municipalityRisk, recommendations };
  }
}
