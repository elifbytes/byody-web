<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Gunakan koneksi database yang sama dengan Lunar
        $connection = config('lunar.database.connection', config('database.default'));
        
        // 2. Dapatkan table prefix dari Lunar
        $prefix = config('lunar.database.table_prefix', '');
        
        $teams = config('permission.teams');
        $tableNames = config('permission.table_names');
        $columnNames = config('permission.column_names');
        $pivotRole = $columnNames['role_pivot_key'] ?? 'role_id';
        $pivotPermission = $columnNames['permission_pivot_key'] ?? 'permission_id';

        foreach ($tableNames as $key => $table) {
            $tableNames[$key] = $prefix . $table;
        }

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        }
        if ($teams && empty($columnNames['team_foreign_key'] ?? null)) {
            throw new \Exception('Error: team_foreign_key on config/permission.php not loaded. Run [php artisan config:clear] and try again.');
        }

        Schema::connection($connection)->disableForeignKeyConstraints();

        try {
            if (! Schema::connection($connection)->hasTable($tableNames['permissions'])) {
                Schema::connection($connection)->create($tableNames['permissions'], function (Blueprint $table) {
                    $table->bigIncrements('id');
                    $table->string('name', 125);
                    $table->string('guard_name', 125);
                    $table->timestamps();

                    $table->unique(['name', 'guard_name']);
                });
                
                info('Created permissions table: ' . $tableNames['permissions']);
            }

            if (! Schema::connection($connection)->hasTable($tableNames['roles'])) {
                Schema::connection($connection)->create($tableNames['roles'], function (Blueprint $table) use ($teams, $columnNames) {
                    $table->bigIncrements('id');
                    if ($teams || config('permission.testing')) {
                        $table->unsignedBigInteger($columnNames['team_foreign_key'])->nullable();
                        $table->index($columnNames['team_foreign_key'], 'roles_team_foreign_key_index');
                    }
                    $table->string('name', 125);
                    $table->string('guard_name', 125);
                    $table->timestamps();
                    if ($teams || config('permission.testing')) {
                        $table->unique([$columnNames['team_foreign_key'], 'name', 'guard_name']);
                    } else {
                        $table->unique(['name', 'guard_name']);
                    }
                });
                
                info('Created roles table: ' . $tableNames['roles']);
            }

            if (! Schema::connection($connection)->hasTable($tableNames['model_has_permissions'])) {
                Schema::connection($connection)->create($tableNames['model_has_permissions'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotPermission, $teams, $connection) {
                    $table->unsignedBigInteger($pivotPermission);

                    $table->string('model_type');
                    $table->unsignedBigInteger($columnNames['model_morph_key']);
                    $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_permissions_model_id_model_type_index');

                    $table->foreign($pivotPermission)
                        ->references('id')
                        ->on($tableNames['permissions'])
                        ->onDelete('cascade');
                        
                    if ($teams) {
                        $table->unsignedBigInteger($columnNames['team_foreign_key']);
                        $table->index($columnNames['team_foreign_key'], 'model_has_permissions_team_foreign_key_index');

                        $table->primary([$columnNames['team_foreign_key'], $pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                            'model_has_permissions_permission_model_type_primary');
                    } else {
                        $table->primary([$pivotPermission, $columnNames['model_morph_key'], 'model_type'],
                            'model_has_permissions_permission_model_type_primary');
                    }
                });
                
                info('Created model_has_permissions table: ' . $tableNames['model_has_permissions']);
            }

            if (! Schema::connection($connection)->hasTable($tableNames['model_has_roles'])) {
                Schema::connection($connection)->create($tableNames['model_has_roles'], function (Blueprint $table) use ($tableNames, $columnNames, $pivotRole, $teams, $connection) {
                    $table->unsignedBigInteger($pivotRole);

                    $table->string('model_type');
                    $table->unsignedBigInteger($columnNames['model_morph_key']);
                    $table->index([$columnNames['model_morph_key'], 'model_type'], 'model_has_roles_model_id_model_type_index');

                    $table->foreign($pivotRole)
                        ->references('id')
                        ->on($tableNames['roles'])
                        ->onDelete('cascade');
                        
                    if ($teams) {
                        $table->unsignedBigInteger($columnNames['team_foreign_key']);
                        $table->index($columnNames['team_foreign_key'], 'model_has_roles_team_foreign_key_index');

                        $table->primary([$columnNames['team_foreign_key'], $pivotRole, $columnNames['model_morph_key'], 'model_type'],
                            'model_has_roles_role_model_type_primary');
                    } else {
                        $table->primary([$pivotRole, $columnNames['model_morph_key'], 'model_type'],
                            'model_has_roles_role_model_type_primary');
                    }
                });
                
                info('Created model_has_roles table: ' . $tableNames['model_has_roles']);
            }

            if (! Schema::connection($connection)->hasTable($tableNames['role_has_permissions'])) {
                Schema::connection($connection)->create($tableNames['role_has_permissions'], function (Blueprint $table) use ($tableNames, $pivotRole, $pivotPermission, $connection) {
                    $table->unsignedBigInteger($pivotPermission);
                    $table->unsignedBigInteger($pivotRole);

                    $table->foreign($pivotPermission)
                        ->references('id')
                        ->on($tableNames['permissions'])
                        ->onDelete('cascade');

                    $table->foreign($pivotRole)
                        ->references('id')
                        ->on($tableNames['roles'])
                        ->onDelete('cascade');

                    $table->primary([$pivotPermission, $pivotRole], 'role_has_permissions_permission_id_role_id_primary');
                });
                
                info('Created role_has_permissions table: ' . $tableNames['role_has_permissions']);
            }

            // Reset cache permissions
            $cache = app('cache');
            $cacheStore = config('permission.cache.store') != 'default' 
                ? config('permission.cache.store') 
                : null;
                
            $cache->store($cacheStore)->forget(config('permission.cache.key'));
            
        } catch (\Exception $e) {
            logger()->error('Lunar permission tables migration failed: ' . $e->getMessage());
            throw $e;
        } finally {
            Schema::connection($connection)->enableForeignKeyConstraints();
        }
    }

    public function down(): void
    {
        $connection = config('lunar.database.connection', config('database.default'));
        $prefix = config('lunar.database.table_prefix', '');
        $tableNames = config('permission.table_names');

        if (empty($tableNames)) {
            throw new \Exception('Error: config/permission.php not found and defaults could not be merged. Please publish the package configuration before proceeding, or drop the tables manually.');
        }

        foreach ($tableNames as $key => $table) {
            $tableNames[$key] = $prefix . $table;
        }

        Schema::connection($connection)->disableForeignKeyConstraints();

        try {
            Schema::connection($connection)->dropIfExists($tableNames['role_has_permissions']);
            Schema::connection($connection)->dropIfExists($tableNames['model_has_roles']);
            Schema::connection($connection)->dropIfExists($tableNames['model_has_permissions']);
            Schema::connection($connection)->dropIfExists($tableNames['roles']);
            Schema::connection($connection)->dropIfExists($tableNames['permissions']);
        } finally {
            Schema::connection($connection)->enableForeignKeyConstraints();
        }
    }
};