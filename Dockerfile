FROM php:8.3-apache

# Instala dependências do sistema
RUN apt-get update && apt-get install -y libpq-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Define o diretório de trabalho
WORKDIR /var/www/html/back-end

# Copia os arquivos necessários para o build (composer.json e composer.lock)
COPY back-end/composer.* ./

# --- AQUI ESTÁ O QUE FALTAVA ---
# Instala as dependências antes de copiar o restante do código
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copia o restante do código da pasta back-end
COPY back-end/ .

# Ajusta o root do Apache
RUN sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/sites-available/000-default.conf

# Permissões do Storage
RUN mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs \
    && chown -R www-data:www-data storage

# Comando final
CMD php artisan migrate --force && apache2-foreground