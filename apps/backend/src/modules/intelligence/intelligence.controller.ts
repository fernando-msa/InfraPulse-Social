import { Controller, Get, Query } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsOptional, IsInt, Max, Min } from "class-validator";
import { IntegrationsService } from "../sources/integrations.service";
import { IntelligenceService } from "./intelligence.service";

class InsightsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

@Controller("v1/intelligence")
export class IntelligenceController {
  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  @Get("insights")
  getInsights(@Query() query: InsightsQueryDto) {
    const limit = query.limit ?? 20;
    return {
      items: this.intelligenceService.getMunicipalityInsights(limit),
      sourceStatus: this.integrationsService.getSourceStatus(),
      generatedAt: new Date().toISOString(),
    };
  }

  @Get("mapa-vulnerabilidade")
  getVulnerabilityMap() {
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
