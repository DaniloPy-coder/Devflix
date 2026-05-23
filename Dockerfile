FROM php:8.4-apache

# 1. Instala dependências essenciais
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath

# 2. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 3. Define diretório
WORKDIR /var/www/html/back-end

# 4. Copia os arquivos de dependência e FORCE a reinstalação
COPY back-end/composer.json back-end/composer.lock ./

RUN rm -rf vendor && composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

COPY back-end/ .

# 6. Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache \
    && chmod -R 775 /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache

# 7. Ajusta o Apache
RUN sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/sites-available/000-default.conf

CMD php artisan migrate --force && apache2-foreground