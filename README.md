# 💻 WebAble 

 A tool designed to evaluate the accessibility of websites and web applications. It helps developers identify and fix common accessibility issues to ensure their content is usable by everyone, including people with disabilities.

![Accessibility Analyzer Dashboard](public/Dashboard.png)

----

## ✨ Core Functionality

- **Automated Accessibility Scanning** – Analyze any website using Lighthouse and axe-core.
- **Comprehensive Reports** – Detailed insights with WCAG compliance and issue breakdowns.
- **Historical Analysis** – Track previous scans and accessibility improvements.
- **Data Management** – Delete scan data when needed.

---

## 🛠️ Tech Stack

| Category      | Technology                                   |
|---------------|----------------------------------------------|
| Frontend      | React, Typescript, Tailwind CSS              |
| Backend       | Flask for API processing                     |
| Database      | MongoDB                                      |
| Modules       | Lighthouse and axe-core                      |


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

3. Start the Flask server:
   ```
   python app.py
   ```

---


## API Endpoints

- **POST /api/scan** - Initiate a website accessibility scan and saves result to MongoDB.
- **GET /api/reports/:id** - Fetches a scan report by either scan ID or URL.
- **GET /api/reports** - Get a list of all scan reports.

---

## 🤝 Contributing

Fork, branch, commit, push, and open a PR — Open to suggestions and contributions!

