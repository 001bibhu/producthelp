# 🚀 ProductHelp AI

**ProductHelp AI** is an analytics and insight platform that helps product, documentation, and support teams understand what users are searching for — and identify missing or underperforming content.

---

## 🌐 Live Demo

👉 https://producthelp.vercel.app/

---

## 🧠 What Problem It Solves

Teams often don’t know:

* What users are searching for
* What content is missing
* Why users are not finding answers
* Which docs need improvement

**ProductHelp AI solves this by turning search behavior into actionable insights.**

---

## ✨ Key Features

* 📊 **Search Analytics Dashboard**

  * Total searches, failed searches, low engagement

* 🔍 **Missing Content Detection**

  * Identify queries with no results

* 📉 **Low Engagement Insights**

  * Detect content that users are not clicking

* ⚡ **Top Actions to Take Now**

  * Prioritized recommendations

* 🔌 **Easy Integration**

  * Add a lightweight script to track search queries

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* CSS

### Backend

* Node.js
* Express

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 🛠️ Local Development Setup

### 1. Clone the repository

git clone https://github.com/001bibhu/producthelp.git
cd producthelp

---

### 2. Run Backend

cd backend
npm install
npm run dev

👉 Runs on: http://localhost:3001

---

### 3. Run Frontend

cd frontend
npm install
npm run dev

👉 Runs on: http://localhost:5173

---

## 🔌 Integration (How to Use ProductHelp AI)

Add ProductHelp AI to your documentation site in minutes.

### Step 1: Add Script

```html
<script src="https://yourdomain.com/producthelp.js"></script>
```

---

### Step 2: Track Search Queries

```javascript
window.productHelp.track("your search query");
```

---

### Step 3: View Insights

Open the dashboard:

👉 https://producthelp.vercel.app/

---

## 🧪 Example Integration

```javascript
function onSearch(query) {
  window.productHelp.track(query);
}
```

---

## ⚠️ Current Limitation

This is currently a **shared demo environment**.

* Data is not isolated per user
* Multiple users will see combined data

👉 Multi-tenant support (API keys) is planned.

---

## 🎯 Target Users

* Product Teams
* Documentation Teams
* Developer Experience Teams
* Support Teams

---

## 🚀 Roadmap

* [ ] API key-based multi-tenant support
* [ ] Real-time tracking SDK improvements
* [ ] AI-powered content recommendations
* [ ] Chrome extension for tracking
* [ ] Integration with tools like Algolia

---

## 🤝 Contributing

Feel free to fork the repo and submit improvements.

---

## 📬 Feedback

If you have feedback or ideas, feel free to reach out or open an issue.

---

## ⭐ If you like this project

Give it a star on GitHub ⭐
