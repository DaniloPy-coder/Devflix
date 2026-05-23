import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://seusite.com.br";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const localMovies = await fetch(`${apiUrl}/api/movies`)
    .then((res) => res.json())
    .catch((err) => {
      console.error("Erro ao gerar sitemap:", err);
      return [];
    });

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  localMovies.forEach((movie: { id: number | string }) => {
    routes.push({
      url: `${baseUrl}/movie/local/${movie.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return routes;
}
