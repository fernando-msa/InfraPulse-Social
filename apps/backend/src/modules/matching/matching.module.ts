import { Module } from "@nestjs/common";
import { IntegrationsModule } from "../sources/integrations.module";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";

@Module({
  imports: [IntegrationsModule],
  providers: [MatchingService],
  controllers: [MatchingController],
})
export class MatchingModule {}
