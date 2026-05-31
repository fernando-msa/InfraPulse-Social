import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IntegrationsService } from "../sources/integrations.service";
import { MatchingService } from "./matching.service";

describe("MatchingService", () => {
  let service: MatchingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchingService, IntegrationsService],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("upsertFamily", () => {
    it("should create and return a family profile", () => {
      const family = service.upsertFamily({
        id: "fam-test",
        municipalityCode: "2800308",
        members: 3,
        incomePerCapita: 150,
        hasChildren: true,
        hasUnemployedAdults: false,
        foodInsecurityReported: false,
      });

      expect(family.id).toBe("fam-test");
      expect(family.members).toBe(3);
    });

    it("should update existing family", () => {
      service.upsertFamily({
        id: "fam-update",
        municipalityCode: "2800308",
        members: 2,
        incomePerCapita: 100,
        hasChildren: false,
        hasUnemployedAdults: false,
        foodInsecurityReported: false,
      });

      const updated = service.upsertFamily({
        id: "fam-update",
        municipalityCode: "2800308",
        members: 5,
        incomePerCapita: 200,
        hasChildren: true,
        hasUnemployedAdults: true,
        foodInsecurityReported: true,
      });

      expect(updated.members).toBe(5);
      expect(updated.incomePerCapita).toBe(200);
    });
  });

  describe("recommendForFamily", () => {
    it("should return recommendations for seeded family", () => {
      const result = service.recommendForFamily("fam-001");

      expect(result.family).toBeDefined();
      expect(result.municipalityRisk).toBeDefined();
      expect(result.recommendations).toBeInstanceOf(Array);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should throw NotFoundException for missing family", () => {
      expect(() => service.recommendForFamily("nonexistent")).toThrow(
        NotFoundException,
      );
    });

    it("should recommend Bolsa Familia for low income", () => {
      const result = service.recommendForFamily("fam-001");
      const bolsaFamilia = result.recommendations.find(
        (r) => r.program === "Bolsa Familia",
      );

      expect(bolsaFamilia).toBeDefined();
      expect(bolsaFamilia?.priority).toBe("alta");
    });

    it("should recommend SINE for unemployed adults", () => {
      const result = service.recommendForFamily("fam-001");
      const sine = result.recommendations.find(
        (r) => r.program === "Intermediacao de vagas SINE",
      );

      expect(sine).toBeDefined();
    });

    it("should recommend SISAN for food insecurity", () => {
      const result = service.recommendForFamily("fam-001");
      const sisan = result.recommendations.find(
        (r) => r.program === "Rede SISAN e banco de alimentos",
      );

      expect(sisan).toBeDefined();
      expect(sisan?.priority).toBe("alta");
    });

    it("should return municipalityRisk as a number", () => {
      const result = service.recommendForFamily("fam-001");
      expect(typeof result.municipalityRisk).toBe("number");
      expect(result.municipalityRisk).toBeGreaterThanOrEqual(0);
    });
  });
});
