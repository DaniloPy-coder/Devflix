Devflix Frontend
O Devflix é um catálogo de filmes moderno, construído para facilitar a descoberta de produções cinematográficas, integrando dados globais do TMDB com um sistema de autenticação próprio.

🚀 Tecnologias Utilizadas
Framework: Next.js (App Router)

Linguagem: TypeScript

Estilização: Tailwind CSS

Gerenciamento de Estado: TanStack Query (React Query)

Consumo de API: Axios

🛠️ Arquitetura do Projeto
O projeto segue uma arquitetura focada em performance e separação de responsabilidades:

Camada de UI: Componentes React responsáveis pela exibição dos dados.

Camada de Dados (TanStack Query): Gerencia o cache e a busca de dados, garantindo que o site seja rápido e resiliente.

Autenticação: O frontend comunica-se com um backend Laravel para gerenciar usuários, mantendo o estado de login no localStorage.

📦 Como Instalar e Rodar
Pré-requisitos
Node.js instalado (v18 ou superior).

O backend Laravel configurado e rodando localmente (ou via Ngrok).

Passo a passo
Clone o repositório e navegue até a pasta:

cd front-end
Instale as dependências:

npm install
Configure as variáveis de ambiente criando um arquivo .env.local:

NEXT_PUBLIC_API_URL=http://localhost:8000 # Ou sua URL do Ngrok

Inicie o servidor de desenvolvimento:

npm run dev

🔐 Autenticação

O frontend utiliza um modal de autenticação que realiza chamadas POST para /api/login e /api/register no backend Laravel. As credenciais do usuário são persistidas no localStorage sob a chave devflix_user.

📁 Estrutura de Pastas

src/app: Rotas e páginas da aplicação.

src/components: Componentes reutilizáveis (Header, Card, Modal).

src/services: Configuração de instâncias de API (Axios) e chamadas ao TMDB.

src/hooks: Hooks customizados (se aplicável).

Deploy:https://devflix-sable.vercel.app
Repositório:https://github.com/DaniloPy-coder/Devflix/tree/main/front-end