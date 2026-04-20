export interface MunicipalitySnapshot {
  municipalityCode: string;
  municipalityName: string;
  state: string;
  ivs: number;
  cadunicoFamilies: number;
  bolsaFamiliaFamilies: number;
  suasCases: number;
  openJobs: number;
  severeFoodInsecurityRate: number;
  sanitationDeficitRate: number;
  healthPressureRate: number;
  updatedAt: string;
}

export interface FamilyProfile {
  id: string;
  municipalityCode: string;
  members: number;
  incomePerCapita: number;
  hasChildren: boolean;
  hasUnemployedAdults: boolean;
  foodInsecurityReported: boolean;
}

export interface MatchingRecommendation {
  program: string;
  reason: string;
  priority: "alta" | "media" | "baixa";
}
