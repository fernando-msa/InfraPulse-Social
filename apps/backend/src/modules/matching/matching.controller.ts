import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { IsBoolean, IsNumber, IsString, Min } from "class-validator";
import { FamilyProfile } from "../types";
import { MatchingService } from "./matching.service";

class UpsertFamilyDto {
  @IsString()
  id!: string;

  @IsString()
  municipalityCode!: string;

  @IsNumber()
  @Min(1)
  members!: number;

  @IsNumber()
  @Min(0)
  incomePerCapita!: number;

  @IsBoolean()
  hasChildren!: boolean;

  @IsBoolean()
  hasUnemployedAdults!: boolean;

  @IsBoolean()
  foodInsecurityReported!: boolean;
}

@Controller("v1/matching")
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post("familias")
  upsertFamily(@Body() body: UpsertFamilyDto): FamilyProfile {
    return this.matchingService.upsertFamily(body);
  }

  @Get("familias/:id/recomendacoes")
  recommend(@Param("id") id: string): unknown {
    return this.matchingService.recommendForFamily(id);
  }
}
