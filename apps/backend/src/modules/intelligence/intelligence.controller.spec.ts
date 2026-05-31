import { Test, TestingModule } from "@nestjs/testing";
import { IntegrationsService } from "../sources/integrations.service";
import { IntelligenceController } from "./intelligence.controller";
import { IntelligenceService } from "./intelligence.service";

describe("IntelligenceController", () => {
  let controller: IntelligenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntelligenceController],
      providers: [IntelligenceService, IntegrationsService],
    }).compile();

    controller = module.get<IntelligenceController>(IntelligenceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getInsights", () => {
    it("should return items with correct structure", () => {
      const result = controller.getInsights({});
      expect(result).toHaveProperty("items");
      expect(result).toHaveProperty("sourceStatus");
      expect(result).toHaveProperty("generatedAt");
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("should respect limit parameter", () => {
      const result = controller.getInsights({ limit: 1 });
      expect(result.items).toHaveLength(1);
    });

    it("should use default limit of 20", () => {
      const result = controller.getInsights({});
      expect(result.items.length).toBeLessThanOrEqual(20);
    });
  });

  describe("getVulnerabilityMap", () => {
    it("should return SE state data", () => {
      const result = controller.getVulnerabilityMap();
      expect(result.state).toBe("SE");
    });

    it("should include legend with bands", () => {
      const result = controller.getVulnerabilityMap();
      expect(result.legend).toHaveProperty("high");
      expect(result.legend).toHaveProperty("medium");
      expect(result.legend).toHaveProperty("low");
    });

    it("should return municipalities array", () => {
      const result = controller.getVulnerabilityMap();
      expect(Array.isArray(result.municipalities)).toBe(true);
    });
  });
});
