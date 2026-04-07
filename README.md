🛒 SmartShop – Full Stack E-Commerce Web Application
📌 Project Overview

SmartShop is a full-stack e-commerce web application where users can browse products, add them to cart, place orders, and track their purchases. The admin can manage products, orders, and inventory through a dedicated dashboard.

This project demonstrates a complete real-world e-commerce workflow using modern web technologies.

🚀 Features
👤 User Features

User Registration & Login (Authentication)

Browse Products with Search & Filter

View Product Details

Add to Cart / Remove from Cart

Checkout & Place Orders

Track Orders (Pending, Shipped, Delivered)

User Profile Management

👨‍💼 Admin Features

Admin Dashboard

Add / Update / Delete Products

Manage Inventory (Stock)

View and Manage Orders

Update Order Status

🏗️ Tech Stack
💻 Frontend

React.js

Tailwind CSS

Axios (API integration)

⚙️ Backend

Java (Spring Boot)

REST APIs

JWT Authentication

🗄️ Database

MySQL (Relational Database)

☁️ Deployment (Optional)

Railway / Render

🗄️ Database Schema

The system uses the following main tables:

Users

Products

Cart

Orders

Order_Items

These tables are connected using relationships to handle user actions and order processing efficiently.

🔄 System Workflow

User registers or logs into the system

User browses available products

Adds products to cart

Proceeds to checkout and completes payment

Order is created and stored in database

User tracks order status

Admin manages products and updates order status

📁 Project Structure
Frontend (React)

components → Reusable UI

pages → Screens (Login, Products, Cart, etc.)

services → API calls

routes → Routing setup

context → Global state

Backend (Spring Boot)

controller → API endpoints

service → Business logic

repository → Database access

model → Entities

config → Security & configuration

🔐 Authentication & Security

JWT-based authentication

Role-based access (USER / ADMIN)

Secure API communication

🎯 Project Objective

The main goal of this project is to:

Understand full-stack development

Implement real-world e-commerce logic

Learn API integration and database management

Build a scalable and structured application

📌 Conclusion

SmartShop is a complete end-to-end e-commerce solution that demonstrates how frontend, backend, and database work together to deliver a seamless user experience.

💬 Author Note

This project was developed as part of a team-based internship to gain hands-on experience in full-stack web development.