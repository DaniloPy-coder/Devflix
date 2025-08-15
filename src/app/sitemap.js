export default async function sitemap() {
    const baseUrl = "https://devflix-drab.vercel.app";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0
        },
        {
            url: `${baseUrl}/movie`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        }
    ];
}
