#!/usr/bin/env bash
# build.sh
composer install --no-dev --optimize-autoloader
php artisan migrate --force