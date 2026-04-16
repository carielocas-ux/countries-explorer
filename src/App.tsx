import { useEffect, useMemo, useState } from "react";
import type { Country } from "./types/country";

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags,capital,population,region",
        );

        if (!response.ok) {
          throw new Error("Não foi possível carregar os países.");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          throw new Error("Resposta inesperada da API.");
        }
      } catch (err) {
        console.error("Erro ao buscar países:", err);
        setCountries([]);
        setError("Ocorreu um erro ao carregar os países. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  const regions = useMemo(() => {
    return [...new Set(countries.map((country) => country.region))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [countries]);

  const filteredCountries = useMemo(() => {
    return countries
      .filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase()),
      )
      .filter((country) => (region ? country.region === region : true))
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  }, [countries, search, region]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-white">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
        <h2 className="mt-6 text-2xl font-semibold">Carregando países</h2>
        <p className="mt-2 text-center text-slate-400">
          Buscando informações ao redor do mundo...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="w-full max-w-lg rounded-2xl border border-red-400/20 bg-red-400/10 p-8 text-center">
          <h2 className="text-2xl font-bold text-red-300">
            Ops, algo deu errado
          </h2>
          <p className="mt-3 text-slate-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
              Countries Explorer
            </p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Explore países ao redor do mundo 🌍
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px_auto]">
            <input
              type="text"
              placeholder="Buscar país pelo nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            />

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option value="">Todas as regiões</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch("");
                setRegion("");
              }}
              className="rounded-xl border border-white/10 bg-slate-900 px-5 py-3 font-medium transition hover:border-cyan-400 hover:text-cyan-400"
            >
              Limpar
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300">
              {filteredCountries.length} país(es) encontrado(s)
            </span>

            {region && (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Região: {region}
              </span>
            )}

            {search && (
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                Busca: {search}
              </span>
            )}
          </div>
        </section>

        {filteredCountries.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
            <h2 className="text-xl font-semibold">Nenhum país encontrado</h2>
            <p className="mt-2 text-slate-400">
              Tente ajustar a busca ou selecionar outra região.
            </p>
          </div>
        ) : (
          <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCountries.map((country) => (
              <article
                key={country.name.common}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/10"
              >
                <div className="overflow-hidden">
                  <img
                    src={country.flags.png}
                    alt={country.name.common}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold">{country.name.common}</h2>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p>
                      <span className="font-semibold text-white">Capital:</span>{" "}
                      {country.capital?.[0] || "N/A"}
                    </p>

                    <p>
                      <span className="font-semibold text-white">Região:</span>{" "}
                      {country.region}
                    </p>

                    <p>
                      <span className="font-semibold text-white">
                        População:
                      </span>{" "}
                      {country.population.toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
