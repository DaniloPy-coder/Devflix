import MovieCatalog from "../components/MovieCatalog";
import { fetchPopularMovies } from "../services/tmdb";

export interface Movie {
  id: number | string;
  title: string;
  overview?: string | null;
  poster_path: string;
  release_date: string;
}

async function fetchLocalMovies(userId?: string): Promise<Movie[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = userId
      ? `${baseUrl}/api/movies?user_id=${userId}`
      : `${baseUrl}/api/movies`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar filmes locais:", error);
    return [];
  }
}

export default async function HomePage() {
  let combinedMovies: Movie[] = [];
  let errorMessage = "";

  try {
    const [fetchedTmdb, fetchedLocal] = await Promise.all([
      fetchPopularMovies(1),
      fetchLocalMovies(),
    ]);

    const listTmdb = (Array.isArray(fetchedTmdb) ? fetchedTmdb : []) as Movie[];
    const listLocal = (
      Array.isArray(fetchedLocal) ? fetchedLocal : []
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
