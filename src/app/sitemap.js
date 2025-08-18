export default async function sitemap() {
    const baseUrl = "https://devflix-drab.vercel.app";

    try {
        const res = await fetch("https://api.devflix.com/movies");
        if (!res.ok) throw new Error("Erro ao buscar filmes");

        const movies = await res.json();

        const movieUrls = movies.map((movie) => ({
            url: `${baseUrl}/movie/${movie.id}`,
            lastModified: new Date(movie.updatedAt),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

        return [
            {
                url: `${baseUrl}/`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 1.0,
            },
            ...movieUrls,
        ];
    } catch (err) {
        console.error("Erro ao gerar sitemap:", err);

        return [
            {
                url: `${baseUrl}/`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 1.0,
            },
        ];
    }
}
