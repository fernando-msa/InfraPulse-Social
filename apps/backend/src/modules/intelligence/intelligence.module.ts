import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../sources/integrations.module";
import { IntelligenceController } from "./intelligence.controller";
import { IntelligenceService } from "./intelligence.service";

@Module({
  imports: [IntegrationsModule],
  providers: [IntelligenceService],
  controllers: [IntelligenceController],
  exports: [IntelligenceService],
})
export class IntelligenceModule {}
