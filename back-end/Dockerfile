FROM php:8.2-apache
RUN apt-get update && apt-get install -y libzip-dev libpq-dev zip unzip \
    && docker-php-ext-install pdo_pgsql zip
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www/html
COPY . .
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN chown -R www-data:www-data /var/www/html/storage
RUN composer install --no-dev --optimize-autoloader
EXPOSE 80
CMD apache2-foreground