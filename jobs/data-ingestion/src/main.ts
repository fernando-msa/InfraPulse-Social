import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { EmploymentConnector } from "./connectors/employment.connector";
import { FoodSecurityConnector } from "./connectors/food-security.connector";
import { HealthConnector } from "./connectors/health.connector";
import { IvsConnector } from "./connectors/ivs.connector";
import { SocialProgramsConnector } from "./connectors/social-programs.connector";
import { UrbanInfraConnector } from "./connectors/urban-infra.connector";
import { Connector, IngestionRecord } from "./types";

async function runIngestion(): Promise<void> {
  const connectors: Connector[] = [
    new IvsConnector(),
    new SocialProgramsConnector(),
    new EmploymentConnector(),
    new FoodSecurityConnector(),
    new UrbanInfraConnector(),
    new HealthConnector(),
  ];

  const payload: IngestionRecord[] = [];

  for (const connector of connectors) {
    const records = await connector.run();
    payload.push(...records);
  }

  const cacheDir = resolve(process.cwd(), "cache");
  await mkdir(cacheDir, { recursive: true });
  const file = resolve(cacheDir, `snapshot-${new Date().toISOString().slice(0, 10)}.json`);

  await writeFile(file, JSON.stringify(payload, null, 2), "utf-8");
  process.stdout.write(`Ingestao finalizada com ${payload.length} registros em ${file}\n`);
}

runIngestion().catch((error) => {
  process.stderr.write(`Falha na ingestao: ${String(error)}\n`);
  process.exit(1);
});
