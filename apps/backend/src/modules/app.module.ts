import { Module } from "@nestjs/common";
import { HealthController } from "./health.controller";
import { IntelligenceModule } from "./intelligence/intelligence.module";
import { MatchingModule } from "./matching/matching.module";
import { IntegrationsModule } from "./sources/integrations.module";

@Module({
  imports: [IntegrationsModule, IntelligenceModule, MatchingModule],
  controllers: [HealthController],
})
export class AppModule {}
