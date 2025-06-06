const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const ObjectId = mongoose.Types.ObjectId;

// ✅ Define initdb before calling it
const initdb = async () => {
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner: new ObjectId('683c1b776e934fb210e46330')
    }));
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database seeded");
};

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/project');
}

main()
    .then(() => {
        console.log("connected to db");
        initdb(); // ✅ Safe to call now
    })
    .catch((err) => {
        console.log(err);
    });
