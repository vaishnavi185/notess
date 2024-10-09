import mongoose from "mongoose";

const connect = async (Database_url) => {
  try {
    const Db_option = {
      dbName: 'pen_down',  // Corrected key name
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true
    };
    await mongoose.connect(Database_url, Db_option);
    console.log('Database connected successfully');
  } catch (error) {
    console.log('Database connection error:', error);
  }
};

export default connect;
