Devflix é um catálogo de filmes construído com Next.js, React, Tailwind CSS e React Query. Ele consome dados da The Movie Database API (TMDb) e permite:

- Visualizar filmes populares.

- Buscar filmes por título com debounce.

- Navegar entre páginas de filmes com paginação ou botão de carregar mais.

- Visualizar detalhes de cada filme em uma página separada.

- Layout responsivo e estilizado.

Tecnologias

 Next.js – Framework React para SSR/SSG.

 React e React DOM – Biblioteca principal.

 Axios – Para requisições HTTP.

 React Query – Gerenciamento de estado assíncrono.

 Tailwind CSS – Framework de CSS utilitário.

 Lucide React – Biblioteca de ícones.

Funcionalidades

- Listagem de filmes populares.

- Pesquisa com debounce e resultados em tempo real.

- Paginação com botões numéricos e navegação anterior/próxima.

- Página de detalhes do filme com sinopse, data de lançamento e avaliação.

- Spinner de carregamento enquanto os dados são buscados.

git clone https://github.com/DaniloPy-coder/Devflix.git
cd devflix
npm install