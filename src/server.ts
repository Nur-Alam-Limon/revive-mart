import app from './app';
import config from './app/config';
import mongoose from 'mongoose';

async function main() {
  try {
    await mongoose.connect(config.MONGO_URL as string);
    console.log('Connected to MongoDB');

    app.listen(config.PORT, () => {
      console.log(`Revive Mart app listening on port ${config.PORT}`);
    });
  } catch (err) {
    // Log any errors related to database connection
    console.error('Error connecting to database:', err);
  }
}

main();
