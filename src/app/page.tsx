import MovieCatalog from "../components/MovieCatalog";
import { fetchPopularMovies } from "../services/tmdb";

export default async function HomePage() {
  let initialMoviesData = null;
  let errorMessage = "";

  try {
    initialMoviesData = await fetchPopularMovies();
  } catch (error) {
    console.error("Erro ao carregar os filmes no servidor:", error);
    errorMessage =
      "Não foi possível carregar os filmes populares no momento. Por favor, tente mais tarde.";
  }

  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
          Catálogo de Filmes
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Explore os filmes mais populares do momento.
        </p>
      </header>

      {errorMessage ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center max-w-xl mx-auto">
          <p className="text-red-600 dark:text-red-400 font-medium">
            {errorMessage}
          </p>
        </div>
      ) : (
        <MovieCatalog initialData={initialMoviesData || []} />
      )}
    </main>
  );
}
