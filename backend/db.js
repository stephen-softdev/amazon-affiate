const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Admin, Analytics } = require('./models');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin and analytics
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
       const saltRounds = 10;
       const passwordHash = bcrypt.hashSync('admin123', saltRounds);
       await Admin.create({ username: 'admin', password: passwordHash });
       console.log('Seeded default admin');
    }

    const analyticsExists = await Analytics.findOne();
    if (!analyticsExists) {
        await Analytics.create({ visitorCount: 0 });
    }

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
