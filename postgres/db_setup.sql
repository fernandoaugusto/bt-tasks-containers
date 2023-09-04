
ALTER DATABASE postgres SET timezone TO "America/Sao_Paulo";

SET SCHEMA 'public';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
