// scripts/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 1. Import your Mongoose models:
const User     = require("../models/Users");
const Category = require("../models/Categories");
const Item     = require("../models/Items");
const General  = require("../models/General");

const SALT_ROUNDS = 12;

// 2. Sample data to insert:
const sampleCategories = [
  {
    name: "Burgers",
    icon: "uploads/icons/burgers.png",      // see “Which images” below
  },
  {
    name: "Pizzas",
    icon: "uploads/icons/pizzas.png",
  },
  {
    name: "Salads",
    icon: "uploads/icons/salads.png",
  },
];

const sampleItems = [
  {
    name: "Classic Cheeseburger",
    description: "Juicy beef patty topped with cheddar cheese, lettuce, tomato, and our special sauce.",
    price: 8.99,
    categoryName: "Burgers",                 // we’ll look up the category by name
    img: "uploads/items/cheeseburger.jpg",   // see “Which images” below
  },
  {
    name: "Margherita Pizza",
    description: "Fresh basil, mozzarella, and tomato sauce on a hand‐tossed crust.",
    price: 10.5,
    categoryName: "Pizzas",
    img: "uploads/items/margherita.jpg",
  },
  {
    name: "Greek Salad",
    description: "Crisp lettuce, cucumber, feta cheese, olives, and our house vinaigrette.",
    price: 6.75,
    categoryName: "Salads",
    img: "uploads/items/greek_salad.jpg",
  },
];

const sampleGeneral = {
  contactPhone:   "+923197877750",
  contactEmail:   "info@myrestaurant.com",
  contactAddress: "123 Main Street, Islamabad, Pakistan",
  Instagram:      "https://www.instagram.com/myrestaurant",
  Facebook:       "https://www.facebook.com/myrestaurant",
  Whatsaap:       "https://wa.me/03197877750",
};

async function runSeed() {
  try {
    // 3. Connect to MongoDB:
    console.log("Seeding database -------- \n\n Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected.");

    // 4. Clear existing data (CAUTION: This deletes everything in these collections)
    await User.deleteMany({});
    await Category.deleteMany({});
    await Item.deleteMany({});
    await General.deleteMany({});
    console.log("All existing Users, Categories, Items, and General docs removed.");

    // 5. Create an admin user:
    const adminPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
    const adminUser = new User({
      name:           "Administrator",
      email:          "admin@admin.com",
      phone:          "+3197877750",
      hashedPassword: adminPassword,
      role:           "admin",
      addresses:      [],       // no addresses needed for this example
    });
    await adminUser.save();
    console.log("✅ Admin user created → email: admin@admin.com, password: admin123");

    // 6. Insert sample categories:
    const createdCategories = [];
    for (let catData of sampleCategories) {
      const cat = new Category({
        name: catData.name.trim(),
        icon: catData.icon,      // e.g. "uploads/icons/burgers.png"
      });
      await cat.save();
      createdCategories.push(cat);
      console.log(`  • Category created: ${cat.name}`);
    }

    // 7. Insert sample items (linking each to its category by name):
    for (let itemData of sampleItems) {
      // find the category object we just inserted:
      const cat = createdCategories.find((c) => c.name === itemData.categoryName);
      if (!cat) continue;

      const itm = new Item({
        name:        itemData.name.trim(),
        description: itemData.description.trim(),
        price:       itemData.price,
        category:    cat._id,
        img:         itemData.img,   // e.g. "uploads/items/cheeseburger.jpg"
      });
      await itm.save();
      console.log(`  • Item created: ${itm.name} (Category: ${cat.name})`);
    }

    // 8. Insert a single General document:
    const gen = new General({
      contactPhone:   sampleGeneral.contactPhone.trim(),
      contactEmail:   sampleGeneral.contactEmail.toLowerCase().trim(),
      contactAddress: sampleGeneral.contactAddress.trim(),
      Instagram:      sampleGeneral.Instagram.trim(),
      Facebook:       sampleGeneral.Facebook.trim(),
      Whatsaap:       sampleGeneral.Whatsaap.trim(),
    });
    await gen.save();
    console.log("✅ General document created with contact + social links.");

    console.log("\n🎉 Seeding complete. Exiting.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed script error:", err);
    process.exit(1);
  }
}

runSeed();
