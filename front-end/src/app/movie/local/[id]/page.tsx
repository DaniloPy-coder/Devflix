import { Metadata } from "next";
import MovieDetailsClient from "../../[id]/MovieDetailClient";

interface LocalMoviePageProps {
  params: Promise<{ id: string }>;
}

async function getLocalMovieData(id: string) {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/movies/${id}`, {
      cache: "no-store",
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error(e);
  }
  return null;
}

export async function generateMetadata({
  params,
}: LocalMoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getLocalMovieData(id);
  return { title: movie?.title || "Detalhes do Filme" };
}

export default async function LocalMoviePage({ params }: LocalMoviePageProps) {
  const { id } = await params;
  const initialData = await getLocalMovieData(id);
  return (
    <main className="grow container mx-auto px-4 py-12 max-w-7xl">
      <MovieDetailsClient
        movieId={id}
        initialData={initialData}
        isLocal={true}
      />
    </main>
  );
}
