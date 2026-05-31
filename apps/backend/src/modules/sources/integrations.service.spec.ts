import { Test, TestingModule } from "@nestjs/testing";
import { IntegrationsService } from "./integrations.service";

describe("IntegrationsService", () => {
  let service: IntegrationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegrationsService],
    }).compile();

    service = module.get<IntegrationsService>(IntegrationsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllSnapshots", () => {
    it("should return all seeded snapshots", () => {
      const snapshots = service.getAllSnapshots();
      expect(snapshots.length).toBeGreaterThanOrEqual(3);
    });

    it("should sort by IVS descending", () => {
      const snapshots = service.getAllSnapshots();
      for (let i = 1; i < snapshots.length; i++) {
        expect(snapshots[i - 1].ivs).toBeGreaterThanOrEqual(snapshots[i].ivs);
      }
    });

    it("should include expected municipalities", () => {
      const snapshots = service.getAllSnapshots();
      const names = snapshots.map((s) => s.municipalityName);

      expect(names).toContain("Aracaju");
      expect(names).toContain("Estancia");
      expect(names).toContain("Nossa Senhora do Socorro");
    });
  });

  describe("getSnapshot", () => {
    it("should return snapshot by municipality code", () => {
      const snapshot = service.getSnapshot("2800308");
      expect(snapshot).toBeDefined();
      expect(snapshot?.municipalityName).toBe("Aracaju");
    });

    it("should return undefined for unknown code", () => {
      const snapshot = service.getSnapshot("9999999");
      expect(snapshot).toBeUndefined();
    });
  });

  describe("refreshSnapshots", () => {
    it("should replace all snapshots", () => {
      service.refreshSnapshots([
        {
          municipalityCode: "9900001",
          municipalityName: "TestCity",
          state: "SE",
          ivs: 0.5,
          cadunicoFamilies: 100,
          bolsaFamiliaFamilies: 50,
          suasCases: 10,
          openJobs: 200,
          severeFoodInsecurityRate: 0.1,
          sanitationDeficitRate: 0.2,
          healthPressureRate: 0.3,
          updatedAt: new Date().toISOString(),
        },
      ]);

      const snapshots = service.getAllSnapshots();
      expect(snapshots).toHaveLength(1);
      expect(snapshots[0].municipalityName).toBe("TestCity");
    });
  });

  describe("getSourceStatus", () => {
    it("should return status for all sources", () => {
      const status = service.getSourceStatus();
      expect(Object.keys(status).length).toBeGreaterThan(0);
      expect(status).toHaveProperty("ivs");
      expect(status).toHaveProperty("cadunico");
      expect(status).toHaveProperty("datasus");
    });

    it("should return string values", () => {
      const status = service.getSourceStatus();
      for (const value of Object.values(status)) {
        expect(typeof value).toBe("string");
      }
    });
  });
});
