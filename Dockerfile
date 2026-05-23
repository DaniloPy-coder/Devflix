FROM php:8.3-apache

# 1. Instala dependências do sistema e extensões necessárias
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath

# 2. Instala o Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN a2enmod rewrite

# 4. Define diretório
WORKDIR /var/www/html/back-end

# 5. Copia os arquivos de dependência
COPY back-end/composer.json back-end/composer.lock ./

# 6. Instala/Atualiza dependências
RUN composer update --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs -W

# 7. Copia o restante dos arquivos
COPY back-end/ .

# 8. Ajusta permissões
RUN chown -R www-data:www-data /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache \
    && chmod -R 775 /var/www/html/back-end/storage /var/www/html/back-end/bootstrap/cache

# 9. Configura o Apache para apontar para a pasta 'public'
RUN sed -i 's|/var/www/html|/var/www/html/back-end/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

# 10. Comando de inicialização
CMD php artisan migrate --force && apache2-foreground