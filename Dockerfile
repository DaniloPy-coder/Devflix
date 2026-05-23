FROM php:8.3-apache

# Instala dependências
RUN apt-get update && apt-get install -y libpq-dev libzip-dev zip unzip \
    && docker-php-ext-install pdo pdo_pgsql zip

# Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# --- MUDANÇA AQUI: Aponta o diretório de trabalho para a pasta back-end ---
WORKDIR /var/www/html/back-end

# Copia o conteúdo da pasta back-end para dentro do diretório de trabalho
COPY back-end/ .

# Ajusta o documento root do Apache para a pasta 'public'
# Como estamos dentro de back-end, o public está em /var/www/html/back-end/public
RUN sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/sites-available/000-default.conf

# Permissões do Storage (agora dentro de back-end)
RUN mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs \
    && chown -R www-data:www-data storage

# Comando de início
CMD php artisan migrate --force && apache2-foreground