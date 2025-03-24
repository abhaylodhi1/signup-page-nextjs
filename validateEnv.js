import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const requiredEnvVars = ['JWT_SECRET'];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing ${envVar} in environment variables.`);
    process.exit(1);
  }
});
