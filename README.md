# 🌐 WebAble – Website Accessibility Analyzer
<div align="center">

![WebAble](https://img.shields.io/badge/WebAble-Accessibility%20Analyzer-6C63FF?style=for-the-badge)

![React](https://img.shields.io/badge/React-2026?style=for-the-badge&logo=react&logoColor=61DAFB&color=20232A)
![TypeScript](https://img.shields.io/badge/TypeScript-2026?style=for-the-badge&logo=typescript&logoColor=3178C6&color=20232A)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-2026?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8&color=20232A)

![Python](https://img.shields.io/badge/Python-Backend?style=for-the-badge&logo=python&logoColor=FFD43B&color=3776AB)
![Flask](https://img.shields.io/badge/Flask-API?style=for-the-badge&logo=flask&logoColor=white&color=000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Database?style=for-the-badge&logo=mongodb&logoColor=white&color=47A248)

![Lighthouse](https://img.shields.io/badge/Lighthouse-Audit?style=for-the-badge&logo=lighthouse&logoColor=white&color=F44B21)
![WCAG](https://img.shields.io/badge/WCAG-Accessibility?style=for-the-badge&color=005A9C)
![Open Source](https://img.shields.io/badge/Open%20Source-Community?style=for-the-badge&logo=github&color=181717)

</div>


**open-source accessibility analysis tool** designed to evaluate the accessibility of websites and web applications. It helps developers identify accessibility issues and improve compliance with **WCAG standards**, ensuring that digital content is usable by everyone — including people with disabilities.

The platform automatically scans websites and generates **detailed accessibility reports**, enabling developers to quickly detect and fix issues affecting usability.

# 📌 Problem Statement

Millions of websites still fail to meet accessibility standards, making them difficult or impossible to use for people with disabilities. Developers often lack tools that provide **clear, actionable accessibility insights during development**.

WebAble addresses this problem by providing:

- Automated accessibility testing
- Detailed issue reports
- Historical tracking of accessibility improvements
- Developer-friendly analysis tools

This helps teams build **inclusive and accessible web applications**.

---

# 🚀 Project Overview

WebAble performs automated accessibility testing using **Lighthouse** and **axe-core** to scan a given website and generate structured reports.

The system provides:

- Accessibility issue detection
- WCAG compliance insights
- Historical report tracking
- Dashboard visualization for accessibility improvements

---

# ✨ Features

# ✨ Key Features

<div align="center">

| Feature | Description |
|---|---|
| 🔍 **Automated WCAG Scanning** | Analyze websites using Lighthouse and axe-core to identify accessibility violations |
| 🤖 **AI Accessibility Agents** | Intelligent agents help detect issues and provide improvement suggestions |
| 📊 **Detailed Reports** | Generate structured accessibility reports with severity levels and WCAG references |
| 📈 **Trend Analytics Dashboard** | Track accessibility improvements and monitor website performance over time |
| 🕒 **Scan History Tracking** | Store previous scans and compare accessibility progress |
| 🛠️ **Developer-Friendly Insights** | Provide actionable fixes to improve usability and compliance |

</div>

# 🛠️ Tech Stack

| Category | Technology |
|--------|-------------|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Flask (Python) |
| Database | MongoDB |
| Accessibility Tools | Lighthouse, axe-core |

---

# 📸 Application Preview

![Accessibility Analyzer Dashboard](public/Dashboard.png)

---

## Getting Started

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python requirements:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file

Inside the `backend` folder, create a `.env` file and add:
```env
MONGO_URI=your_mongodb_connection_string
```

> ⚠️ Replace with your actual MongoDB Atlas connection string.  
> Make sure your MongoDB Atlas cluster is set up and your IP is whitelisted.

4. Start the Flask server:
   ```
   python app.py
   ```

---


## API Endpoints

- **POST /api/scan** - Initiate a website accessibility scan and saves result to MongoDB.
- **GET /api/reports/:id** - Fetches a scan report by either scan ID or URL.
- **GET /api/reports** - Get a list of all scan reports.

---

## 📂 Project Structure
```
WebAble/
│
├── .agents/
│ └── skills/ # AI agent skills and configurations
│
├── backend/ # Flask backend and scanning services
│ ├── app.py # Backend entry point
│ ├── server.js # Server configuration
│ ├── scan_service.js # Accessibility scanning logic
│ └── requirements.txt # Python dependencies
│
├── public/ # Static assets
│ └── Dashboard.png
│
├── src/ # React frontend source code
│ │
│ ├── components/ # Reusable UI components
│ ├── hooks/ # Custom React hooks
│ ├── pages/ # Application pages
│ ├── services/ # API services
│ ├── utils/ # Helper utilities
│ │
│ ├── App.tsx # Main React component
│ └── main.tsx # Frontend entry point
│
├── index.html # HTML template
├── package.json # Project dependencies
└── README.md # Documentation

---

# 🤝 Contributing 
We welcome contributions from the community!
    
## How to Contribute 

### 1. Fork the repository

### 2. Create a feature branch 
```
git checkout -b feature-name
```
### 3. Commit your changes
```
git commit -m "Add new feature"
```

### 4. Push the branch 
```
git push origin feature-name 
```

### 5. Open a Pull Request 🚀 
    
Contributors can help with:

*   Bug fixes
    
*   UI improvements
    
*   Accessibility rule enhancements
    
*   Performance optimizations
    
*   Documentation improvements

---

## 👩‍💻 Maintainer

**Harshika Rathod**
Project Maintainer and Developer of WebAble.

---

## ⭐ Support the Project

If you find this project useful, consider giving it a star ⭐ on [GitHub](https://github.com) to support the project and help others discover it.
