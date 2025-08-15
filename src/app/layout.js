import Script from "next/script";
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-365405548`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-365405548');
          `}
        </Script>

        <ReactQueryProvider>
          <SearchProvider>
            <Header />
            <main className="pt-20 flex-grow">{children}</main>
            <Footer />
          </SearchProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

