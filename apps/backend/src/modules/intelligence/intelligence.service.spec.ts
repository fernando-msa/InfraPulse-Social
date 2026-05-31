import { Test, TestingModule } from "@nestjs/testing";
import { IntegrationsService } from "../sources/integrations.service";
import { IntelligenceService } from "./intelligence.service";

describe("IntelligenceService", () => {
  let service: IntelligenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntelligenceService, IntegrationsService],
    }).compile();

    service = module.get<IntelligenceService>(IntelligenceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getMunicipalityInsights", () => {
    it("should return insights with correct structure", () => {
      const insights = service.getMunicipalityInsights(10);
      expect(insights.length).toBeGreaterThan(0);

      const first = insights[0];
      expect(first).toHaveProperty("municipalityCode");
      expect(first).toHaveProperty("municipalityName");
      expect(first).toHaveProperty("socialRiskScore");
      expect(first).toHaveProperty("topSignals");
      expect(first).toHaveProperty("updatedAt");
    });

    it("should respect limit parameter", () => {
      const insights = service.getMunicipalityInsights(1);
      expect(insights).toHaveLength(1);
    });

    it("should sort by IVS descending (highest risk first)", () => {
      const insights = service.getMunicipalityInsights(10);
      for (let i = 1; i < insights.length; i++) {
        expect(insights[i - 1].socialRiskScore).toBeGreaterThanOrEqual(
          insights[i].socialRiskScore,
        );
      }
    });

    it("should compute risk score between 0 and 1", () => {
      const insights = service.getMunicipalityInsights(10);
      for (const insight of insights) {
        expect(insight.socialRiskScore).toBeGreaterThanOrEqual(0);
        expect(insight.socialRiskScore).toBeLessThanOrEqual(1);
      }
    });

    it("should return empty array for limit 0", () => {
      const insights = service.getMunicipalityInsights(0);
      expect(insights).toHaveLength(0);
    });
  });
});
