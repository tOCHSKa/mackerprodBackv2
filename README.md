# ⚙️ MackerProd Backend V2

A production-ready REST API built for the **MackerProd video editor platform**, handling authentication, contact requests, and business logic.

This backend powers the live website:
🌐 https://www.mackerprod.com

---

# 🚀 Project Context

This backend was built to support a real freelance video editor platform.

It provides:

* authentication system
* contact form handling
* business logic for frontend consumption
* secure and scalable API architecture

The system is currently deployed and used in production.

---

# 🎯 Key Features

* 🔐 JWT Authentication system
* 👤 User management (register, login, profile)
* 📩 Contact form API (frontend integration)
* 🛡️ Security middleware (rate limiting, validation)
* ⚡ RESTful API architecture
* 🌐 Production-ready deployment

---

# 🏗️ Architecture

## Backend Structure

* Node.js runtime
* Express.js framework
* Modular architecture (routes / controllers / services)
* REST API design principles

## API Communication

This backend is consumed by a Nuxt frontend via REST calls:

* Frontend: Nuxt.js (SSR)
* Backend: Node.js API
* Communication: HTTP REST API

---

# 🧱 Tech Stack

* Node.js
* Express.js
* JWT (Authentication)
* CORS middleware
* Dotenv configuration

---

# 📦 Installation

```bash id="install"
git clone https://github.com/tOCHSKa/mackerprodBackv2.git
cd mackerprodBackv2
npm install
```

---

# ⚙️ Environment Setup

Create a `.env` file:

```env id="env"
PORT=3000

JWT_SECRET=your_secret_key

# Optional (if used)
DATABASE_URL=your_database_url
```

---

# 🚀 Run the project

### Development

```bash id="dev"
npm run dev
```

### Production

```bash id="prod"
node server.js
```

---

# 🌐 API Endpoints

## 🔐 Authentication

| Method | Route              | Description      |
| ------ | ------------------ | ---------------- |
| POST   | /api/auth/register | Register user    |
| POST   | /api/auth/login    | Login user       |
| GET    | /api/auth/me       | Get user profile |

---

## 📩 Contact

| Method | Route        | Description          |
| ------ | ------------ | -------------------- |
| POST   | /api/contact | Send contact message |

---

# 🔌 Frontend Integration

This API is consumed by the frontend:

👉 https://github.com/tOCHSKa/mackerprodV2
🌐 Live site: https://www.mackerprod.com

---

# 🧠 Challenges

* Designing a clean REST API architecture
* Handling authentication securely with JWT
* Connecting backend to a real production frontend
* Deploying and maintaining a VPS-based environment
* Managing CORS and environment configuration

---

# 🚀 Deployment

This backend is deployed on a VPS (IONOS) with:

* Linux server environment
* Node.js process running in production
* Secure environment variables
* Domain-connected frontend integration

---

# 📈 Evolution

This backend evolved from a simple API into a **production system powering a real client website**, with:

* authentication system
* scalable structure
* frontend integration
* real-world deployment

---

# 👨‍💻 Author

Built by **tOCHSKa**

---

# 📄 License

MIT
