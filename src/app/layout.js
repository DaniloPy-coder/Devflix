import { Analytics } from "@vercel/analytics/next"
import { ReactQueryProvider } from "lib/react-query";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SearchProvider } from "context/SearchContext";

export const metadata = {
  title: "Devflix",
  description: "Filmes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-800 text-white font-sans antialiased min-h-screen flex flex-col">

        <ReactQueryProvider>
          <SearchProvider>
            <Header />
            <main className="pt-20 flex-grow">{children}</main>
            <Footer />
          </SearchProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}

