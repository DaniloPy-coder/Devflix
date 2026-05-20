import { Metadata } from "next";
import MovieDetailsClient from "./MovieDetailClient";
import { fetchMovieById } from "@/src/services/tmdb";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await fetchMovieById(id);
    return { title: `${movie.title} | Catálogo de Filmes` };
  } catch {
    return { title: "Detalhes do Filme" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  let initialMovieData = null;

  try {
    initialMovieData = await fetchMovieById(id);
  } catch (error) {
    console.error("Erro no fetch dos detalhes do filme no servidor:", error);
  }

  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <MovieDetailsClient movieId={id} initialData={initialMovieData} />
    </main>
  );
}
