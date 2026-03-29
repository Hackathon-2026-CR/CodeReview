require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");
const Task = require("./src/models/Task");

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🗑  Cleared existing data");

    // ── Hash passwords ──
    const hashed = await bcrypt.hash("password123", ROUNDS);

    const users = [
      {
        name: "alice",
        password: hashed,
        email: "alice@test.com",
        credits: 500,
        groups: ["premium", "public"],
        languages: ["JavaScript", "Python"],
        rating: null,
      },
      {
        name: "bob",
        password: hashed,
        email: "bob@test.com",
        credits: 300,
        groups: ["public"],
        languages: ["Python", "Java"],
        rating: null,
      },
      {
        name: "charlie",
        password: hashed,
        email: "charlie@test.com",
        credits: 200,
        groups: ["premium", "public"],
        languages: ["C++", "Rust"],
        rating: null,
      },
      {
        name: "diana",
        password: hashed,
        email: "diana@test.com",
        credits: 400,
        groups: ["vip", "public"],
        languages: ["CSS", "HTML"],
        rating: null,
      },
      {
        name: "evan",
        password: hashed,
        email: "evan@test.com",
        credits: 150,
        groups: ["vip", "premium"],
        languages: ["JavaScript", "C++"],
        rating: null,
      },
    ];

    const tasks = [
      // ── PUBLIC ──
      {
        title: "Fix React useEffect bug",
        user_name: "alice",
        price: 20,
        languages: ["JavaScript"],
        description: "My useEffect runs infinitely, please help.",
        groups: ["public"],
        code: `useEffect(() => {\n  fetchData();\n}, [data]); // infinite loop`,
        status: "pending",
      },
      {
        title: "Optimize Python sorting algorithm",
        user_name: "bob",
        price: 15,
        languages: ["Python"],
        description: "This bubble sort is too slow for large arrays.",
        groups: ["public"],
        code: `def bubble_sort(arr):\n  for i in range(len(arr)):\n    for j in range(len(arr)-1):\n      if arr[j] > arr[j+1]:\n        arr[j], arr[j+1] = arr[j+1], arr[j]\n  return arr`,
        status: "pending",
      },
      {
        title: "CSS Grid layout broken on mobile",
        user_name: "diana",
        price: 10,
        languages: ["CSS"],
        description: "Grid collapses on small screens.",
        groups: ["public"],
        code: `.grid {\n  display: grid;\n  grid-template-columns: repeat(4, 1fr);\n  gap: 1rem;\n}`,
        status: "pending",
      },
      {
        title: "Java NullPointerException",
        user_name: "bob",
        price: 25,
        languages: ["Java"],
        description: "Getting NPE on line 42, can't figure out why.",
        groups: ["public"],
        code: `String name = null;\nSystem.out.println(name.length()); // NPE`,
        status: "pending",
      },

      // ── PREMIUM ──
      {
        title: "React Redux architecture review",
        user_name: "alice",
        price: 50,
        languages: ["JavaScript"],
        description: "Full Redux store review for a large app.",
        groups: ["premium"],
        code: `const store = configureStore({\n  reducer: { user: userReducer, tasks: taskReducer }\n});`,
        status: "pending",
      },
      {
        title: "C++ memory leak detection",
        user_name: "evan",
        price: 40,
        languages: ["C++"],
        description: "Valgrind shows memory leaks, need expert eyes.",
        groups: ["premium"],
        code: `int* ptr = new int[100];\n// forgot delete[] ptr;`,
        status: "pending",
      },

      // ── VIP ──
      {
        title: "Full HTML/CSS landing page review",
        user_name: "diana",
        price: 60,
        languages: ["HTML", "CSS"],
        description: "Full design + code review of my landing page.",
        groups: ["vip"],
        code: `<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body><h1>Hello World</h1></body>\n</html>`,
        status: "pending",
      },
      {
        title: "JavaScript performance audit",
        user_name: "evan",
        price: 80,
        languages: ["JavaScript"],
        description: "App is slow, need a full performance review.",
        groups: ["vip"],
        code: `for (let i = 0; i < 10000; i++) {\n  document.getElementById('app').innerHTML += i;\n}`,
        status: "pending",
      },
    ];

    await User.insertMany(users);
    console.log(`👤 Inserted ${users.length} users`);

    await Task.insertMany(tasks);
    console.log(`📋 Inserted ${tasks.length} tasks`);

    console.log("\n✅ Seed complete! Credentials:");
    users.forEach((u) => console.log(`  ${u.name} / password123`));
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
