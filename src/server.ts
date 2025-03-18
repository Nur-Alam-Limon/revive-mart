import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.mongo_url as string);
    console.log('Connected to MongoDB');

    app.listen(config.port, () => {
      console.log(`Revive Mart app listening on port ${config.port}`);
    });
  } catch (err) {
    // Log any errors related to database connection
    console.error('Error connecting to database:', err);
  }
}

main();
