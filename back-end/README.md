Devflix Backend

Este é o servidor de backend do projeto Devflix, desenvolvido em Laravel. Atualmente, sua responsabilidade principal é o gerenciamento de usuários, incluindo autenticação (login) e registro.

🚀 Tecnologias Utilizadas

Framework: Laravel

Banco de Dados: MySQL/SQLite

Arquitetura: API RESTful

🛠️ Funcionalidades Atuais

O backend funciona como uma API de identidade, expondo rotas para:

Registro: Criação de novos usuários.

Login: Validação de credenciais e retorno dos dados do usuário.

📦 Como Instalar e Rodar

Pré-requisitos

PHP 8.x instalado.

Composer instalado.

Servidor de banco de dados configurado (MySQL ou SQLite).

Passo a passo

Navegue até a pasta do backend: cd back-end

Instale as dependências: composer install

Configure o arquivo .env:

Copie o .env.example para .env

Configure as credenciais do seu banco de dados (DB_CONNECTION, DB_DATABASE, etc.).Gere a chave da aplicação:

php artisan key:generate

Rode as migrações para criar a tabela de usuários:php artisan migrate

Inicie o servidor:php artisan serve

🔐 Rotas da APIAs rotas estão definidas no arquivo routes/api.php:

Método     Rota     Descrição

POST/api/register Cadastra um novo usuário

POST/api/login Autentica um usuário

⚙️ Configuração de CORS

Como o frontend (Next.js) se comunica com este backend (frequentemente via Ngrok), certifique-se de que o arquivo config/cors.php esteja configurado para aceitar a origem do seu frontend para evitar erros de bloqueio de acesso.

Repositório: https://github.com/DaniloPy-coder/Devflix/tree/main/back-end