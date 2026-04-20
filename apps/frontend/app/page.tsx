type InsightItem = {
  municipalityCode: string;
  municipalityName: string;
  socialRiskScore: number;
  topSignals: string[];
};

type ApiResponse = {
  items: InsightItem[];
  generatedAt: string;
};

async function fetchInsights(): Promise<ApiResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001/api";
  const res = await fetch(`${baseUrl}/v1/intelligence/insights?limit=10`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar insights do backend");
  }

  return (await res.json()) as ApiResponse;
}

function scoreClass(score: number): string {
  if (score >= 0.35) return "chip chip-high";
  if (score >= 0.25) return "chip chip-medium";
  return "chip chip-low";
}

export default async function HomePage() {
  const data = await fetchInsights();
  const avg =
    data.items.reduce((acc, item) => acc + item.socialRiskScore, 0) /
    Math.max(1, data.items.length);

  return (
    <main className="page">
      <section className="hero">
        <h1>InfraPulse Social</h1>
        <p>
          Camada de inteligencia e orquestracao social para Sergipe, integrando IVS,
          programas sociais, emprego, seguranca alimentar, infraestrutura urbana e saude.
        </p>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <span>Municipios monitorados</span>
          <strong>{data.items.length}</strong>
        </article>
        <article className="kpi-card">
          <span>Risco social medio</span>
          <strong>{avg.toFixed(3)}</strong>
        </article>
        <article className="kpi-card">
          <span>Ultima atualizacao</span>
          <strong>{new Date(data.generatedAt).toLocaleString("pt-BR")}</strong>
        </article>
      </section>

      <section className="table-section">
        <h2>Mapa de Vulnerabilidade (MVP)</h2>
        <table>
          <thead>
            <tr>
              <th>Municipio</th>
              <th>Score</th>
              <th>Sinais prioritarios</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.municipalityCode}>
                <td>{item.municipalityName}</td>
                <td>
                  <span className={scoreClass(item.socialRiskScore)}>
                    {item.socialRiskScore.toFixed(3)}
                  </span>
                </td>
                <td>{item.topSignals.join(" | ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
