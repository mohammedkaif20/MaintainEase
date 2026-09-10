# MaintainEase 🔧
### Residential Maintenance Management System

A college B.Tech project built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

---

## 📁 Project Structure

```
maintainease/
├── client/
│   ├── index.html               ← Home page
│   ├── public/
│   │   ├── style.css            ← All CSS styles
│   │   ├── login.css            ← Auth page styles
│   │   └── js/
│   │       ├── home.js
│   │       ├── login.js          ← Auth logic (register/login/JWT)
│   │       ├── complaint-form.js
│   │       ├── complaint-history.js
│   │       ├── admin-dashboard.js
│   │       ├── manage-complaints.js
│   │       ├── update-complaint.js
│   │       └── contact.js
│   └── views/
│       ├── login.html            ← Login & Register page (Resident / Admin)
│       ├── complaint-form.html
│       ├── complaint-history.html
│       ├── admin-dashboard.html
│       ├── manage-complaints.html
│       ├── update-complaint.html
│       ├── about.html
│       └── contact.html
└── server/
    ├── app.js                   ← Entry point
    ├── package.json
    ├── models/
    │   ├── User.js              ← User schema (bcrypt hashed password)
    │   └── Complaint.js         ← MongoDB schema
    ├── routes/
    │   ├── auth.js              ← Auth API routes
    │   └── complaints.js        ← Complaints API routes
    └── controllers/
        ├── authController.js    ← Register, Login, getMe logic
        └── complaintController.js ← Complaint business logic
```

---

## ⚙️ How to Run

### Step 1 – Make sure MongoDB is running
Start MongoDB on your machine (default port: 27017).

### Step 2 – Start the server
```bash
cd server
npm start
```
You should see:
```
Connected to MongoDB
Server running at http://localhost:3000
```

### Step 3 – Open the app
Open your browser and go to: **http://localhost:3000**

---

## 🌐 Pages

| Page | URL |
|---|---|
| Home | http://localhost:3000 |
| Login / Register | http://localhost:3000/views/login.html |
| Report Issue | http://localhost:3000/views/complaint-form.html |
| My Complaints | http://localhost:3000/views/complaint-history.html |
| Admin Dashboard | http://localhost:3000/views/admin-dashboard.html |
| Manage Complaints | http://localhost:3000/views/manage-complaints.html |
| About | http://localhost:3000/views/about.html |
| Contact | http://localhost:3000/views/contact.html |

---

## 🔌 API Endpoints

### 🔐 Auth Routes — `/api/auth`

| Method | URL | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user (resident or admin) |
| POST | /api/auth/login | Login and receive a JWT token |
| GET | /api/auth/me | Get current user info (requires token) |

### 📋 Complaint Routes — `/api/complaints`

| Method | URL | Description |
|---|---|---|
| POST | /api/complaints | Add new complaint |
| GET | /api/complaints | Get all complaints |
| GET | /api/complaints/:id | Get single complaint |
| PUT | /api/complaints/:id | Update complaint |
| DELETE | /api/complaints/:id | Delete complaint |

---

## 🔐 Authentication

- Users can register as **Resident** or **Admin** from the login page.
- Passwords are hashed using **bcryptjs** before being stored in MongoDB.
- On login, a signed **JWT token** is returned and stored in `localStorage`.
- Token includes the user's role and ID, used for role-based redirects:
  - Residents → Home page
  - Admins → Admin Dashboard

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs

