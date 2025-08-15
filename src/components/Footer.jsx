"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-center py-4 mt-10 border-t border-gray-700">
      <p>
        &copy; {new Date().getFullYear()}
        <span className="text-red-500 ml-1">Dev</span>flix. Todos os direitos
        reservados.
      </p>
    </footer>
  );
}
