import { Metadata } from "next";
import MovieDetailsClient from "./MovieDetailClient";
import { fetchMovieById } from "@/src/services/tmdb";

export const dynamic = "force-dynamic";
interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await fetchMovieById(id);
    return { title: movie.title };
  } catch {
    return { title: "Detalhes" };
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  let initialData = null;
  try {
    initialData = await fetchMovieById(id);
  } catch (e) {
    console.error(e);
  }
  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <MovieDetailsClient
        movieId={id}
        initialData={initialData}
        isLocal={false}
      />
    </main>
  );
}
