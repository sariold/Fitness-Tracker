# 🏋️‍♂️ Fitness Tracker

A responsive **React web app** that helps you visualize your **workout progress** over time by charting **body weight** and **top set weights** for various exercises. 📈

---

## 🛠️ Technologies Used

- ⚛️ **React** (functional components + hooks) for dynamic UI
- 📄 **PapaParse** to efficiently parse CSV workout data
- 📊 **Chart.js** + `react-chartjs-2` for beautiful, interactive line graphs
- 🎨 **CSS Modules** for modular and scoped styling
- 🧮 **Google Sheets CSV** as a live data source — update your workouts without redeploying!

---

## ✨ Features

- 🔗 **Live CSV import** from Google Sheets for real-time updates
- 🎯 **Exercise selector** and **custom date range filters**
- 📈 Dual-axis charts showing **body weight** and **top set trends**
- 🔍 **Zoom & Pan** functionality for detailed analysis
- 🚧 Handles **loading states**, **missing data**, and **errors** gracefully

---

## 🧰 Setup

1. 📥 Clone this repo  
2. 🧩 Run `npm install` to install dependencies  
3. ▶️ Run `npm start` to launch locally in your browser  

---

## 🧠 Challenges & Solutions

🚧 Workout data often had inconsistent names like `"Bench Press"` vs `"Flat Bench"` — so I created a **mapping dictionary** to unify naming conventions.

⚡️ Ensured smooth filtering and date handling with performant state management using React hooks.

---

## 📚 What I Learned

- 🎯 Advanced chart techniques with **Chart.js** (zoom, pan, responsive time axes)
- 🔄 Async CSV fetching + parsing and state syncing in React
- 🎨 UI design using **React hooks** and **modular CSS**
- 🧪 Edge-case handling for user inputs and transforming raw workout data

---

💪 **Track your progress. Analyze your gains. All in your browser.**
