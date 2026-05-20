const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

export interface TMDBMovieDetail extends TMDBMovie {
  overview: string;
}

export async function fetchPopularMovies(page = 1): Promise<TMDBMovie[]> {
  if (!API_KEY) {
    throw new Error(
      "A chave de API do TMDb não foi configurada no arquivo .env.local",
    );
  }

  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar os filmes populares do TMDb");
  }

  const data = await response.json();
  return data.results;
}

export async function fetchMovieById(id: string): Promise<TMDBMovieDetail> {
  if (!API_KEY) {
    throw new Error(
      "A chave de API do TMDb não foi configurada no arquivo .env.local",
    );
  }

  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-BR`,
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar os detalhes do filme com ID ${id}`);
  }

  return response.json();
}
