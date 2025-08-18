export default async function sitemap() {
    const baseUrl = 'https://devflix-drab.vercel.app';
    const movies = await fetch('https://api.devflix.com/movies').then(res => res.json());
    const movieUrls = movies.map(movie => ({
        url: `${baseUrl}/movie/${movie.id}`,
        lastModified: new Date(movie.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7
    }));

    return [
        { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        ...movieUrls
    ];
}
