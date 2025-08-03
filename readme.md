# Installation
## Clone the repository
```bash
git clone https://github.com/elifbytes/byody-web.git

cd byody-web
```

## Install dependencies
```bash
composer install
npm install
```

## Copy the example environment file
```bash
cp .env.example .env
```

## Generate application key
```bash
php artisan key:generate
```

## Set up the database

- Create a new database and update the `.env` file with your database credentials.
```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

- Run the migrations
```bash
php artisan migrate
```

## Seed the database
```bash
php artisan db:seed
```

- Install lunar
```bash
php artisan lunar:install
```

## Build assets
```bash
npm run build
```