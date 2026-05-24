export const dynamic = "force-dynamic";
import { unstable_noStore as noStore } from "next/cache";
import MovieCatalog from "../components/MovieCatalog";
import { fetchPopularMovies } from "../services/tmdb";

export interface Movie {
  id: number | string;
  title: string;
  overview?: string | null;
  poster_path: string;
  release_date: string;
}

export default async function HomePage() {
  noStore();

  const tmdbMovies = await fetchPopularMovies(1);
  const listTmdb = (Array.isArray(tmdbMovies) ? tmdbMovies : []) as Movie[];

  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mb-3">
          Catálogo de Filmes
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Explore os filmes globais do TMDB
        </p>
      </header>

      <MovieCatalog initialData={listTmdb} />
    </main>
  );
}
