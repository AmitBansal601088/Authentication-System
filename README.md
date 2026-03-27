# 🚀 Full Stack Authentication System (Node.js + MongoDB)

A complete backend authentication system built with **Node.js, Express, MongoDB, and JWT**, featuring secure user registration, login, email verification, and password reset functionality.

---

## 🔥 Features

* ✅ User Registration
* ✅ Email Verification (via Mailtrap)
* ✅ Secure Login (JWT + Cookies)
* ✅ Password Hashing (bcrypt)
* ✅ Protected Routes (Auth Middleware)
* ✅ Logout Functionality
* ✅ Forgot Password (Token-based)
* ✅ Reset Password with Expiry
* ✅ MongoDB Atlas Integration

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT (jsonwebtoken)
* bcryptjs
* Nodemailer (Mailtrap)
* Cookie-parser
* dotenv

---

## 📂 Project Structure

```
project/
│
├── controller/
│   └── user.controller.js
│
├── middleware/
│   └── auth.middleware.js
│
├── model/
│   └── User_model.js
│
├── Router/
│   └── user.route.js
│
├── util/
│   └── db.js
│
├── .env
├── index.js
└── package.json
```

---

## ⚙️ Installation

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

---

## 🔐 Environment Variables (.env)

Create a `.env` file in root:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

MAIL_TRAP_HOST=sandbox.smtp.mailtrap.io
MAIL_TRAP_USERNAME=your_username
MAIL_TRAP_PASSWORD=your_password
MAIL_TRAP_SENDEREMAIL=test@example.com

SECRETKEY=your_jwt_secret
BASE_URL=http://localhost:3000
```

---

## 🚀 Run the Server

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔹 Auth Routes

| Method | Endpoint                    | Description      |
| ------ | --------------------------- | ---------------- |
| POST   | /api/v1/users/register      | Register user    |
| GET    | /api/v1/users/verify/:token | Verify email     |
| POST   | /api/v1/users/login         | Login user       |
| POST   | /api/v1/users/logout        | Logout user      |
| GET    | /api/v1/users/profile       | Get user profile |

---

### 🔹 Password Routes

| Method | Endpoint                     | Description     |
| ------ | ---------------------------- | --------------- |
| POST   | /api/v1/users/forgotpassword | Send reset link |
| POST   | /api/v1/users/resetpassword  | Reset password  |

---

## 🔐 Authentication Flow

1. User registers
2. Verification email sent (Mailtrap)
3. User verifies account
4. Login generates JWT token (stored in cookie)
5. Protected routes accessed via middleware

---

## 🔒 Security Features

* Password hashing using bcrypt
* HTTP-only cookies
* JWT-based authentication
* Token expiration handling
* One-time password reset tokens

---

## 🧪 Testing

Use **Postman** to test APIs.

---

## ⚠️ Important Notes

* Do NOT expose `.env` file
* Use HTTPS in production (`secure: true` cookies)
* Rotate secrets if leaked

---

## 📌 Future Improvements

* Refresh Token system
* Role-based authorization (Admin/User)
* Rate limiting
* Email service (production SMTP)

---

## 👨‍💻 Author

Amit Bansal

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
