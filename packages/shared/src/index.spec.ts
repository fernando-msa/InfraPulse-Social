import { calculateSocialRisk, RiskInputs } from "./index";

describe("calculateSocialRisk", () => {
  const baseInput: RiskInputs = {
    ivs: 0.3,
    foodInsecurityRate: 0.15,
    sanitationDeficitRate: 0.25,
    healthPressureRate: 0.5,
    openJobs: 1000,
  };

  it("should return a number between 0 and 1", () => {
    const score = calculateSocialRisk(baseInput);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("should round to 3 decimal places", () => {
    const score = calculateSocialRisk(baseInput);
    const decimals = score.toString().split(".")[1];
    expect(decimals ? decimals.length : 0).toBeLessThanOrEqual(3);
  });

  it("should increase score with higher IVS", () => {
    const lowIvs = calculateSocialRisk({ ...baseInput, ivs: 0.1 });
    const highIvs = calculateSocialRisk({ ...baseInput, ivs: 0.9 });
    expect(highIvs).toBeGreaterThan(lowIvs);
  });

  it("should increase score with higher food insecurity", () => {
    const low = calculateSocialRisk({ ...baseInput, foodInsecurityRate: 0.05 });
    const high = calculateSocialRisk({ ...baseInput, foodInsecurityRate: 0.5 });
    expect(high).toBeGreaterThan(low);
  });

  it("should increase score with fewer open jobs", () => {
    const manyJobs = calculateSocialRisk({ ...baseInput, openJobs: 4000 });
    const fewJobs = calculateSocialRisk({ ...baseInput, openJobs: 100 });
    expect(fewJobs).toBeGreaterThan(manyJobs);
  });

  it("should not let job protection go below 0", () => {
    const score = calculateSocialRisk({ ...baseInput, openJobs: 5000 });
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
