# 🧪 Somvob Assignment Backend (Express + MongoDB + TypeScript)

A secure and scalable RESTful API built with **Express**, **MongoDB (Mongoose)**, **TypeScript**, and **Zod** for validation.

---

## 🚀 Features

- ✅ TypeScript-based backend
- 🔐 JWT authentication with role-based access
- 🧾 Global input validation using Zod
- 📦 MongoDB with Mongoose ODM
- ⚙️ Clean middleware and config structure
- 🧪 API testing ready (with Postman & Jest)

---

## 🛠️ Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (Atlas or local)
- [Postman](https://www.postman.com/) (optional)

---

## 📁 Project Structure

```
src/
├── app.ts              # Express app setup
├── server.ts           # App entry point
├── config/             # Environment configs, DB connection
├── models/             # Mongoose schemas/models
├── routes/             # API route handlers
├── middleware/         # Custom Express middlewares (auth, validation, etc.)
├── utils/              # Helper utilities (e.g., validate)
├── types/              # Zod schemas, global TypeScript types
└── scripts/            # DB seeding or admin user creation scripts
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/job-api.git
cd job-api
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create a `.env` file

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/your-db-name
JWT_SECRET=your-super-secret-key
```

✅ Tip: Add a `.env.example` to your repo so others can replicate your setup.

---

## 🧪 Run the App

### Development Mode (with hot-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

---

## 🧪 Run Tests

```bash
npm run test
```

You can also create a test user for login using the provided script:

```bash
npx ts-node src/scripts/createUser.ts
```

> Make sure your DB is connected (`MONGO_URI`) before running the script.

---

## 🔐 Authentication

### 🔑 Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

Response:

```json
{
  "token": "your.jwt.token"
}
```

Use this token in **Authorization headers** for protected routes:

```
Authorization: Bearer <token>
```

---

## 📘 Example APIs

### ✅ Create Job (Admin only)

```http
POST /api/jobs
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "location": "Remote"
}
```

Expected response:

```json
{
  "status": 1,
  "message": "Job created successfully",
  "data": {
    "_id": "...",
    "title": "...",
    ...
  }
}
```

---

### 🔍 Get Job By ID

```http
GET /api/jobs/:id
```

---

## 📦 Validation with Zod

- All route inputs are validated using **Zod schemas**.
- Zod schemas live in:

```
src/types/
```

- Global validation middleware is located in:

```
src/middleware/validate.ts
```

---

## ⚙️ Configuration

- DB connection is handled in:

```
src/config/db.ts
```

- App-wide config (e.g., port, env vars) can also be organized here.

---

## 🐳 Docker Support (Optional)

### Dockerfile

```Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD [ "node", "dist/server.js" ]
```

### Build & Run

```bash
docker build -t job-api .
docker run -p 5000:5000 --env-file .env job-api
```

---

## 🚀 Deployment

Deployable on:

- Render
- Railway
- Heroku
- DigitalOcean
- Vercel (API-only)

Set the following env vars in the dashboard:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`

---

## ✨ Author

Made with ❤️ by [Md Sirazul Islam](https://github.com/sirazul263)

---

## 📜 License

[MIT](LICENSE)
