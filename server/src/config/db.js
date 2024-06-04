const databaseClient = require("mongoose");
const dbName = "BO_DB";

async function connect() {
  try {
    await databaseClient.connect(`mongodb://127.0.0.1:27017/${dbName}`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connect to MongoDB successfully!");
    
  } catch (err) {
    console.log(`Error connecting to Mongo`);
  }
}

module.exports = {
  connect: connect,
};
