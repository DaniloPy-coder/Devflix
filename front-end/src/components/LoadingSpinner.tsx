export default function LoadingSpinner() {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 gap-3"
      suppressHydrationWarning
    >
      <div className="w-10 h-10 border-4 border-neutral-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Carregando filmes...
      </p>
    </div>
  );
}
