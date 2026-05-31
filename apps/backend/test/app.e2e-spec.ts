import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/modules/app.module";

describe("InfraPulse Social API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("/api/health (GET)", () => {
    it("should return health status", () => {
      return request(app.getHttpServer())
        .get("/api/health")
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty("status", "ok");
          expect(res.body).toHaveProperty("timestamp");
        });
    });
  });

  describe("/api/v1/intelligence", () => {
    it("/insights - should return insights", () => {
      return request(app.getHttpServer())
        .get("/api/v1/intelligence/insights")
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty("items");
          expect(res.body).toHaveProperty("sourceStatus");
          expect(res.body).toHaveProperty("generatedAt");
          expect(Array.isArray(res.body.items)).toBe(true);
          expect(res.body.items.length).toBeGreaterThan(0);
        });
    });

    it("/insights - should respect limit parameter", () => {
      return request(app.getHttpServer())
        .get("/api/v1/intelligence/insights")
        .query({ limit: 1 })
        .expect(200)
        .expect((res: any) => {
          expect(res.body.items).toHaveLength(1);
        });
    });

    it("/insights - should reject invalid limit", () => {
      return request(app.getHttpServer())
        .get("/api/v1/intelligence/insights?limit=abc")
        .expect(400);
    });

    it("/insights - should reject limit > 200", () => {
      return request(app.getHttpServer())
        .get("/api/v1/intelligence/insights?limit=201")
        .expect(400);
    });

    it("/mapa-vulnerabilidade - should return vulnerability map", () => {
      return request(app.getHttpServer())
        .get("/api/v1/intelligence/mapa-vulnerabilidade")
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty("state", "SE");
          expect(res.body).toHaveProperty("municipalities");
          expect(res.body).toHaveProperty("legend");
          expect(Array.isArray(res.body.municipalities)).toBe(true);
        });
    });
  });

  describe("/api/v1/matching", () => {
    it("/familias/:id/recomendacoes - should return recommendations", () => {
      return request(app.getHttpServer())
        .get("/api/v1/matching/familias/fam-001/recomendacoes")
        .expect(200)
        .expect((res: any) => {
          expect(res.body).toHaveProperty("family");
          expect(res.body).toHaveProperty("municipalityRisk");
          expect(res.body).toHaveProperty("recommendations");
          expect(Array.isArray(res.body.recommendations)).toBe(true);
        });
    });

    it("/familias/:id/recomendacoes - should return 404 for unknown family", () => {
      return request(app.getHttpServer())
        .get("/api/v1/matching/familias/fam-unknown/recomendacoes")
        .expect(404);
    });

    it("/familias - should create a family", () => {
      const family = {
        id: "fam-e2e-test",
        municipalityCode: "2800308",
        members: 4,
        incomePerCapita: 200,
        hasChildren: true,
        hasUnemployedAdults: false,
        foodInsecurityReported: false,
      };

      return request(app.getHttpServer())
        .post("/api/v1/matching/familias")
        .send(family)
        .expect(201)
        .expect((res: any) => {
          expect(res.body).toEqual(family);
        });
    });

    it("/familias - should reject invalid payload", () => {
      return request(app.getHttpServer())
        .post("/api/v1/matching/familias")
        .send({ id: "test" })
        .expect(400);
    });
  });
});
