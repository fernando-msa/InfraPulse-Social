import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IntegrationsService } from "../sources/integrations.service";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";

describe("MatchingController", () => {
  let controller: MatchingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchingController],
      providers: [MatchingService, IntegrationsService],
    }).compile();

    controller = module.get<MatchingController>(MatchingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("upsertFamily", () => {
    it("should create a family and return it", () => {
      const result = controller.upsertFamily({
        id: "fam-test-ctrl",
        municipalityCode: "2800308",
        members: 4,
        incomePerCapita: 200,
        hasChildren: true,
        hasUnemployedAdults: false,
        foodInsecurityReported: false,
      });

      expect(result.id).toBe("fam-test-ctrl");
      expect(result.members).toBe(4);
    });
  });

  describe("recommend", () => {
    it("should return recommendations for existing family", () => {
      const result = controller.recommend("fam-001");
      expect(result).toHaveProperty("family");
      expect(result).toHaveProperty("recommendations");
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should throw for nonexistent family", () => {
      expect(() => controller.recommend("nonexistent")).toThrow(
        NotFoundException,
      );
    });
  });
});
