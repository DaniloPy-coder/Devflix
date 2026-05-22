import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const localMovies = await fetch("http://127.0.0.1:8000/api/movies")
    .then((res) => res.json())
    .catch(() => []);

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
