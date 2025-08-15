"use client";

import { useDebounce } from "hooks/useDebounce";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  const [temp, setTemp] = useState(value);
  const debouncedValue = useDebounce(temp, 500);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
        placeholder="Buscar filmes..."
        className="w-full sm:w-64 p-2 pl-8 rounded border border-gray-600 bg-gray-900 text-white"
      />
    </div>
  );
}
