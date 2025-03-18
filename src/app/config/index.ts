import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  node_env: process.env.NODE_ENV,
};
