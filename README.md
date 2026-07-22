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
│   │   └── js/
│   │       ├── home.js
│   │       ├── complaint-form.js
│   │       ├── complaint-history.js
│   │       ├── admin-dashboard.js
│   │       ├── manage-complaints.js
│   │       ├── update-complaint.js
│   │       └── contact.js
│   └── views/
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
    │   └── Complaint.js         ← MongoDB schema
    ├── routes/
    │   └── complaints.js        ← API routes
    └── controllers/
        └── complaintController.js ← Business logic
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
| Report Issue | http://localhost:3000/views/complaint-form.html |
| My Complaints | http://localhost:3000/views/complaint-history.html |
| Admin Dashboard | http://localhost:3000/views/admin-dashboard.html |
| Manage Complaints | http://localhost:3000/views/manage-complaints.html |
| About | http://localhost:3000/views/about.html |
| Contact | http://localhost:3000/views/contact.html |

---

## 🔌 API Endpoints

| Method | URL | Description |
|---|---|---|
| POST | /api/complaints | Add new complaint |
| GET | /api/complaints | Get all complaints |
| GET | /api/complaints/:id | Get single complaint |
| PUT | /api/complaints/:id | Update complaint |
| DELETE | /api/complaints/:id | Delete complaint |

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
