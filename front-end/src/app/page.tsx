import MovieCatalog from "../components/MovieCatalog";
import { fetchPopularMovies } from "../services/tmdb";
interface Movie {
  id?: number | string;
  title: string;
  overview?: string | null;
  poster_path?: string | null;
  release_date?: string | null;
  genres?: Array<{ id: number; name: string }>;
}

async function fetchLocalMovies(): Promise<Movie[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/movies", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar filmes locais do Laravel:", error);
    return [];
  }
}

export default async function HomePage() {
  let combinedMovies: Movie[] = [];
  let errorMessage = "";

  try {
    const [tmdbMovies, localMovies] = await Promise.all([
      fetchPopularMovies(),
      fetchLocalMovies(),
    ]);

    const listTmdb = (Array.isArray(tmdbMovies) ? tmdbMovies : []) as Movie[];
    const listLocal = (
      Array.isArray(localMovies) ? localMovies : []
    ) as Movie[];

    combinedMovies = [...listLocal, ...listTmdb];

    if (combinedMovies.length === 0) {
      errorMessage = "Nenhum filme encontrado no momento.";
    }
  } catch (error) {
    console.error("Erro geral na HomePage:", error);
    errorMessage = "Ocorreu um erro ao carregar o catálogo de filmes.";
  }

  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
          Catálogo de Filmes
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Explore os filmes globais do TMDB misturados aos seus títulos
          personalizados locais!
        </p>
      </header>

      {errorMessage ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {errorMessage}
          </p>
        </div>
      ) : (
        <MovieCatalog initialData={combinedMovies} />
      )}
    </main>
  );
}
