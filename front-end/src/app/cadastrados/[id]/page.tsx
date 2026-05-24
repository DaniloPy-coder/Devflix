import { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import MovieDetailsClient from "../../movie/[id]/MovieDetailClient";

export const dynamic = "force-dynamic";
interface LocalMoviePageProps {
  params: Promise<{ id: string }>;
}

async function getLocalMovieData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await fetch(`${baseUrl}/api/movies/${id}`, {
      cache: "no-store",
    });

    if (res.ok) return await res.json();
  } catch (e) {
    console.error("Erro ao buscar dados do filme:", e);
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
