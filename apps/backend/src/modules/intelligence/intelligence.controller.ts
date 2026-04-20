import { Controller, Get, Query } from "@nestjs/common";
import { IntegrationsService } from "../sources/integrations.service";
import { IntelligenceService } from "./intelligence.service";

@Controller("v1/intelligence")
export class IntelligenceController {
  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  @Get("insights")
  getInsights(@Query("limit") limit?: string): unknown {
    const parsedLimit = Number.parseInt(limit ?? "20", 10);
    return {
      items: this.intelligenceService.getMunicipalityInsights(parsedLimit),
      sourceStatus: this.integrationsService.getSourceStatus(),
      generatedAt: new Date().toISOString(),
    };
  }

  @Get("mapa-vulnerabilidade")
  getVulnerabilityMap(): unknown {
    return {
      state: "SE",
      municipalities: this.intelligenceService.getMunicipalityInsights(75),
      legend: {
        high: "score >= 0.35",
        medium: "0.25 <= score < 0.35",
        low: "score < 0.25",
      },
    };
  }
}
