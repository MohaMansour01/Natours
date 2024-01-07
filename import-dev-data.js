const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./models/tourModel");
const Review = require("./models/reviewModel");
const User = require("./models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
 
// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   })
//   .then(console.log('DB connection successful'));
 
const tours = JSON.parse(fs.readFileSync(`./starter/dev-data/data/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`./starter/dev-data/data/users.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`./starter/dev-data/data/reviews.json`, 'utf-8'));
 
const importData = async () => {
  await mongoose
    .connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    .then(console.log('DB connection successful'));
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
 
const deleteData = async () => {
  try {
    await mongoose
      .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      .then(console.log('DB connection successful'));
      await Tour.remove({});
      await User.remove({});
      await Review.remove({});
     res.status(200).json({status:200, message: "data deletete successfull"});
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
 
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
 
console.log(process.argv);