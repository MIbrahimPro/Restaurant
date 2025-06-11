// scripts/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// 1. Import your Mongoose models:
const User = require("../models/Users");
const Category = require("../models/Categories");
const Item = require("../models/Items");
const General = require("../models/General");

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
    contactPhone: "+923197877750",
    contactEmail: "info@myrestaurant.com",
    contactAddress: "123 Main Street, Islamabad, Pakistan",
    Instagram: "https://www.instagram.com/myrestaurant",
    Facebook: "https://www.facebook.com/myrestaurant",
    Whatsaap: "https://wa.me/03197877750",
};

async function runSeed() {
    const force = process.argv.includes("--force");

    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected.");

        // 3. Determine if we should seed:
        const [
            userCount,
            catCount,
            itemCount,
            genCount
        ] = await Promise.all([
            User.countDocuments(),
            Category.countDocuments(),
            Item.countDocuments(),
            General.countDocuments()
        ]);

        if (!force && (userCount || catCount || itemCount || genCount)) {
            console.log("⚠️  Data already exists. Skipping seeding.");
            process.exit(0);
        }

        if (force) {
            console.log("🧹 --force flag detected: clearing existing data…");
        }

        // 4. Clear existing data (only if force or first run)
        await Promise.all([
            User.deleteMany({}),
            Category.deleteMany({}),
            Item.deleteMany({}),
            General.deleteMany({})
        ]);
        console.log("🗑️  Existing collections dropped.");

        // 5. Create an admin user:
        const adminPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
        await User.create({
            name: "Administrator",
            email: "admin@admin.com",
            phone: "+3197877750",
            hashedPassword: adminPassword,
            role: "admin",
            addresses: [],
        });
        console.log("👤 Admin user created → email: admin@admin.com, password: admin123");

        // 6. Insert sample categories:
        const createdCategories = [];
        for (let catData of sampleCategories) {
            const cat = await Category.create(catData);
            createdCategories.push(cat);
            console.log(`  • Category: ${cat.name}`);
        }

        // 7. Insert sample items:
        for (let itemData of sampleItems) {
            const category = createdCategories.find(c => c.name === itemData.categoryName);
            if (!category) continue;
            await Item.create({
                name: itemData.name,
                description: itemData.description,
                price: itemData.price,
                category: category._id,
                img: itemData.img,
            });
            console.log(`  • Item: ${itemData.name}`);
        }

        // 8. Insert general info
        await General.create(sampleGeneral);
        console.log("📋 General info document created.");

        console.log("\n🎉 Seeding complete.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seed script error:", err);
        process.exit(1);
    }
}

runSeed();
