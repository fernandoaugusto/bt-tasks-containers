const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');

async function runMigrations() {
  try {
    console.log('Running migrations...');

    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
    });
    
    console.log('Migrations completed.');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

module.exports={ runMigrations };