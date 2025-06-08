# 📁 CSV Management Tool

A full-stack MERN-like application for uploading, managing, editing, and exporting CSV files with authentication.

## 🧰 Tech Stack

- **Frontend:** Next.js 14+, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js, Prisma ORM, PostgreSQL
- **Auth:** JWT (Passport.js)
- **File Handling:** Multer
- **CSV Parsing & Export:** csv-parser, json2csv

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js ≥ 18
- npm / yarn
- neon.tech cloud PostgreSQL DB

---

### ⚙️ Back-End Setup (Node.js + Express)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/csv-management-tool.git](https://github.com/susil-jena/csv-tool.git
   cd csv-management-tool


2. Navigate to the back-end folder:

   ```bash
   cd csv-backend

3. Install dependencies:
   
   ```bash
   npm install

4. Create a .env file inside csv-backend:
   ```bach
   DATABASE_URL=postgresql://neondb_owner:example@ep-bold-tree-a1vnvb0j-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   JWT_SECRET=ab12345gsklsols
   PORT=5000

5. From the csv-backend directory:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init

6. Start backend server:
   ```bash
   node index.js


---

### ⚙️ Front-End Setup (Next.js)
   
1. Navigate to the front-end folder:

   ```bash
   cd csv-frontend

2. Install dependencies:
   
   ```bash
   npm install

3. Create a .env file inside csv-frontend:
   ```bach
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000





