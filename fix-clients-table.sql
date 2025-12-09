-- Verificar estructura actual
SHOW COLUMNS FROM clients;

-- Si existe id_old, eliminarlo
ALTER TABLE clients DROP COLUMN IF EXISTS id_old;

-- Limpiar migraciones corruptas
DELETE FROM adonis_schema WHERE name = 'database/migrations/1768791000000_clients_prepare_string_id';
DELETE FROM adonis_schema WHERE name = 'database/migrations/1768792000000_clients_add_string_id';

-- Verificar estructura final
SHOW COLUMNS FROM clients;
