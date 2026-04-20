export interface RiskInputs {
  ivs: number;
  foodInsecurityRate: number;
  sanitationDeficitRate: number;
  healthPressureRate: number;
  openJobs: number;
}

export function calculateSocialRisk(input: RiskInputs): number {
  const jobProtection = Math.max(0, 1 - input.openJobs / 4000);
  const score =
    input.ivs * 0.35 +
    input.foodInsecurityRate * 0.25 +
    input.sanitationDeficitRate * 0.15 +
    input.healthPressureRate * 0.2 +
    jobProtection * 0.05;

  return Math.round(score * 1000) / 1000;
}
