# Assignment Project - Blog Platform

Một ứng dụng blog hiện đại với **RESTful API backend** (Node.js + Express) và **frontend SPA** (React + Vite).

## 📂 Cấu trúc project

```
Assignment/
├── backend/          # RESTful API (Node.js + Express + MongoDB)
├── frontend/         # React SPA (Vite + Tailwind CSS)
├── .env              # Environment variables (tạo từ .env.example)
└── README.md
```

---

## 🚀 Quick Start

### Backend Setup

1. **Cài dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Cấu hình MongoDB**
   - **Option A: MongoDB Atlas (Cloud - Recommended)**
     - Tạo tài khoản miễn phí: https://www.mongodb.com/cloud/atlas
     - Tạo M0 Free tier cluster
     - Copy connection string
   
   - **Option B: MongoDB Local**
     - Cài MongoDB: https://www.mongodb.com/try/download/community
     - Khởi service: `net start MongoDB` (Admin)
     - Hoặc chạy: `mongod --dbpath "C:\data\db"`

3. **Setup `.env`**
   ```bash
   cp .env.example .env
   ```
   
   Cập nhật `backend/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/assignment_db
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

4. **Khởi server**
   ```bash
   npm run dev
   ```
   Server sẽ chạy trên: **http://localhost:5000**

### Frontend Setup

1. **Cài dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Khởi dev server**
   ```bash
   npm run dev
   ```
   Frontend sẽ chạy trên: **http://localhost:5173**

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` — Đăng ký tài khoản
- `POST /api/auth/login` — Đăng nhập (trả JWT)
- `GET /api/auth/me` — Lấy user hiện tại (protected)

### Posts
- `GET /api/posts` — Danh sách bài viết (hỗ trợ ?page=, ?limit=, ?search=, ?category=)
- `GET /api/posts/:id` — Chi tiết bài viết
- `POST /api/posts` — Tạo bài viết (protected)
- `PUT /api/posts/:id` — Cập nhật bài viết (chủ sở hữu)
- `DELETE /api/posts/:id` — Xóa bài viết (chủ sở hữu)
- `POST /api/posts/:id/like` — Toggle like (protected)

### Comments
- `GET /api/posts/:postId/comments` — Danh sách bình luận
- `POST /api/posts/:postId/comments` — Thêm bình luận (protected)
- `DELETE /api/comments/:id` — Xóa bình luận (tác giả/chủ bài)

---

## 🧪 Test với Postman / Thunder Client

1. Import collection: `backend/postman_collection.json`
2. Test endpoints bằng Postman / Thunder Client
3. Sau mỗi login, copy token và thêm vào `Authorization: Bearer <token>`

---

## 🎨 Frontend Features

- ✅ Routes: `/`, `/login`, `/register`, `/create-post`, `/edit-post/:id`, `/profile`, `/posts/:id`
- ✅ Responsive design (mobile-first)
- ✅ Tailwind CSS styling
- ✅ Context API for auth state
- ✅ Form validation (React Hook Form + Zod)
- ✅ Loading states & toast notifications
- ✅ Protected routes

---

## 🔐 Tech Stack

**Backend**
- Node.js v18+
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- CORS

**Frontend**
- React 18+
- Vite
- React Router v6
- Tailwind CSS
- Axios
- React Hook Form + Zod
- Context API

---

## ⚠️ Notes

- JWT token được lưu trong `localStorage`
- Backend server sẽ retry kết nối MongoDB mỗi 5 giây nếu chưa kết nối
- Mỗi request từ frontend sẽ tự động thêm `Authorization: Bearer <token>` header
- API response format: `{ data, message, errors }`

---

## 📄 Environment Variables

**Backend `.env`**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/assignment_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend `.env`** (optional)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Troubleshooting

**MongoDB connection refused**
- Kiểm tra MongoDB đã khởi động: `Get-Service -Name MongoDB`
- Khởi service: `net start MongoDB` (cần Admin)
- Hoặc dùng Atlas cloud

**CORS error**
- Đảm bảo `CLIENT_URL` trong backend `.env` khớp với frontend URL

**Frontend API not connecting**
- Kiểm tra backend port 5000 có chạy: `netstat -ano | findstr :5000`
- Kiểm tra `VITE_API_URL` (default: http://localhost:5000/api)

---

## 📚 Learning Outcomes

- ✅ RESTful API design & best practices
- ✅ JWT authentication & authorization
- ✅ Password hashing (bcryptjs)
- ✅ Database design (MongoDB + Mongoose)
- ✅ React hooks & Context API
- ✅ Form validation & error handling
- ✅ Responsive UI with Tailwind CSS
- ✅ API integration with Axios

Enjoy building! 🚀

