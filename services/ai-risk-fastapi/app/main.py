import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="InfraPulse AI Risk Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:3001")],
    allow_methods=["GET", "POST"],
    allow_credentials=True,
)


class RiskInput(BaseModel):
    ivs: float = Field(ge=0, le=1)
    food_insecurity_rate: float = Field(ge=0, le=1)
    sanitation_deficit_rate: float = Field(ge=0, le=1)
    health_pressure_rate: float = Field(ge=0, le=1)
    open_jobs: int = Field(ge=0)


class PrioritizationInput(BaseModel):
    social_risk_score: float = Field(ge=0, le=1)
    sla_hours: int = Field(ge=1)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/risk/score")
def score_risk(payload: RiskInput) -> dict[str, float | str]:
    job_protection = max(0.0, 1.0 - (payload.open_jobs / 4000))
    score = (
        payload.ivs * 0.35
        + payload.food_insecurity_rate * 0.25
        + payload.sanitation_deficit_rate * 0.15
        + payload.health_pressure_rate * 0.2
        + job_protection * 0.05
    )

    if score >= 0.35:
        band = "alto"
    elif score >= 0.25:
        band = "medio"
    else:
        band = "baixo"

    return {"score": round(score, 3), "band": band}


@app.post("/risk/prioritize")
def prioritize(payload: PrioritizationInput) -> dict[str, str | int]:
    score = payload.social_risk_score
    if score >= 0.4:
        priority = "P1"
        due_in_hours = min(24, payload.sla_hours)
    elif score >= 0.3:
        priority = "P2"
        due_in_hours = min(48, payload.sla_hours)
    else:
        priority = "P3"
        due_in_hours = payload.sla_hours

    return {
        "priority": priority,
        "due_in_hours": due_in_hours,
        "recommended_action": "Encaminhar para equipe territorial com plano de resposta",
    }
