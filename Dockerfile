FROM php:8.3-apache

# 1. Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath

# 2. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html/back-end

COPY back-end/composer.json back-end/composer.lock ./

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && sed -i 's/display_errors = Off/display_errors = On/g' "$PHP_INI_DIR/php.ini" \
    && sed -i 's/display_startup_errors = Off/display_startup_errors = On/g' "$PHP_INI_DIR/php.ini"

RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

COPY back-end/ .

RUN sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/apache2.conf

# 8. Permissões
RUN chown -R www-data:www-data /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache \
    && chmod -R 775 /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache
# 9. Comando final
CMD php artisan migrate --force && apache2-foreground