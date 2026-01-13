#  PropertyHub

PropertyHub is a **full-stack MERN (MongoDB, Express, React, Node.js)** web application that allows users to list, browse, and manage properties for sale or rent.

This project is developed as an **academic project** to demonstrate full-stack development skills including authentication, CRUD operations, and real-world features.

---

##  Features

###  User Features
- User authentication (Email & Google Sign-In)
- Create property listings
- Upload multiple property images
- View own listings
- Delete own listings
- Search properties by location and category
- Wishlist properties

###  Property Features
- Property types: House, Apartment, Villa, Plot, Farmhouse, Agricultural Land, Store
- Category-based dynamic features
- City & State selection (India)
- Inside / Outside city option
- Distance from city (for outside city properties)
- Image gallery for listings

###  Security
- JWT authentication
- Protected routes
- Cookie-based session handling
-  Role-based access (User / Admin)


---

##  Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Redux Toolkit
- Firebase Authentication

**Backend**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication

---

## 📁 Project Structure
PropertyHub/
│
├── api/                # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
│
├── client/             # Frontend (React)
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md


---

##  How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/sahanasagar63/PropertyHub.git
cd PropertyHub

2️⃣ Backend Setup
cd api
npm install
npm run dev

3️⃣ Frontend Setup
cd client
npm install
npm run dev

# Environment Variables
Create a .env file in the api folder and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

# Academic Note
This project is created for learning and academic purposes.
It demonstrates real-world concepts such as:
	•	Authentication
	•	Database design
	•	Frontend–backend integration
	•	Role-based access control
	•	REST API development

# Developer
Sahana s
Diploma in Computer Science
Full-Stack Development (MERN)


#Acknowledgement
Special thanks to online learning resources and mentors that helped in completing this project.











