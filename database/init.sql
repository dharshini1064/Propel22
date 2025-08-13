-- Create database
CREATE DATABASE propel22;

-- Connect to the database
\c propel22;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: The actual tables will be created by Sequelize ORM
-- This script is just for initial database setup