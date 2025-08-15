import Link from "next/link";

export default function MovieCard({ movie }) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="bg-gray-800 rounded overflow-hidden hover:scale-105 transition"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        loading="lazy"
        className=" w-full h-72 object-cover"
      />
      <div className="p-2">
        <h2>{movie.title}</h2>
        <p className="text-sm text-gray-500">
          {movie.release_date?.split("-")[0]}
        </p>
      </div>
    </Link>
  );
}
