# 🅿️ Smart Parking Management System

A full-stack web application that helps students and faculty view available parking spaces on campus and reserve parking slots. It also provides an admin dashboard to manage parking spaces and reservations.

> **Note:** This is a beginner-friendly college project, not a production-level application. It has no authentication system by design — this is intentional for a simplified academic demonstration.

---

## ✨ Features

### For Users
- **Home Page** — View live parking statistics and navigate to key features
- **Browse Parking Spaces** — View all parking spaces with filters by location, vehicle type, and availability
- **Reserve a Space** — Book a parking slot by filling out a simple reservation form
- **My Reservations** — Look up reservations by ID or vehicle number
- **Cancel Reservations** — Cancel active reservations with one click

### For Admins
- **Admin Dashboard** — View statistics and navigate to management pages
- **Manage Parking Spaces** — Add, edit, and delete parking spaces
- **Manage Reservations** — View all reservations with filters, cancel active ones

### Reservation Logic
- Reservations cannot be made for past dates
- End time must be after start time
- Vehicle type must match the parking space type
- No overlapping active reservations for the same space at the same time
- Cancelling a reservation frees the time slot
- Parking spaces are not permanently marked as occupied — availability is determined dynamically

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, JavaScript, HTML, CSS |
| Backend | Java 17, Spring Boot 3.2, Spring Web, Spring Data JPA, Hibernate, Maven |
| Database | MySQL 8.0+ |
| Communication | REST APIs, Fetch API |

### Architecture

```
React Frontend (localhost:5173)
       ↓ REST APIs
Spring Boot Backend (localhost:8080)
       ↓ JPA / Hibernate
MySQL Database (localhost:3306)
```

---

## 📁 Project Structure

```
smart-parking-system/
├── frontend/                          # React + Vite
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Navigation bar
│   │   │   ├── ParkingCard.jsx        # Parking space card
│   │   │   ├── ReservationForm.jsx    # Reservation modal form
│   │   │   ├── ReservationTable.jsx   # Reusable reservation table
│   │   │   └── StatCard.jsx           # Statistics card
│   │   ├── context/
│   │   │   └── ToastContext.jsx       # Toast notification system
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Parking.jsx            # Browse parking spaces
│   │   │   ├── MyReservations.jsx     # Reservation lookup
│   │   │   ├── AdminDashboard.jsx     # Admin overview
│   │   │   ├── ManageParking.jsx      # CRUD parking spaces
│   │   │   └── ManageReservations.jsx # Manage all reservations
│   │   ├── services/
│   │   │   └── api.js                 # API service layer
│   │   ├── App.jsx                    # Route configuration
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Design system & styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                           # Spring Boot + Maven
│   ├── src/main/java/com/parking/
│   │   ├── controller/
│   │   │   ├── ParkingController.java
│   │   │   ├── ReservationController.java
│   │   │   └── AdminController.java
│   │   ├── service/
│   │   │   ├── ParkingService.java
│   │   │   └── ReservationService.java
│   │   ├── repository/
│   │   │   ├── ParkingRepository.java
│   │   │   └── ReservationRepository.java
│   │   ├── entity/
│   │   │   ├── ParkingSpace.java
│   │   │   └── Reservation.java
│   │   ├── dto/
│   │   │   └── ReservationRequest.java
│   │   ├── exception/
│   │   │   └── GlobalExceptionHandler.java
│   │   ├── config/
│   │   │   └── CorsConfig.java
│   │   └── ParkingApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql                   # Sample data (10 parking spaces)
│   └── pom.xml
│
└── README.md
```

---

## 🗄️ Database Design

### Table: `parking_spaces`

| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | Primary Key, Auto Increment |
| space_number | VARCHAR | Unique, Not Null |
| location | VARCHAR | Not Null |
| vehicle_type | ENUM | CAR, BIKE |
| status | ENUM | AVAILABLE, OCCUPIED |

### Table: `reservations`

| Column | Type | Constraint |
|--------|------|-----------|
| id | BIGINT | Primary Key, Auto Increment |
| name | VARCHAR | Not Null |
| user_type | ENUM | STUDENT, FACULTY |
| vehicle_number | VARCHAR | Not Null |
| vehicle_type | ENUM | CAR, BIKE |
| parking_space_id | BIGINT | Foreign Key → parking_spaces(id) |
| reservation_date | DATE | Not Null |
| start_time | TIME | Not Null |
| end_time | TIME | Not Null |
| status | ENUM | ACTIVE, CANCELLED, COMPLETED |

---

## 🚀 How to Run

### Prerequisites

- **Java 17** or higher — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MySQL 8.0+** — [Download](https://dev.mysql.com/downloads/)

### Step 1: Set Up MySQL Database

Open MySQL and create the database:

```sql
CREATE DATABASE parking_db;
```

### Step 2: Configure Database Credentials

Open `backend/src/main/resources/application.properties` and update the MySQL credentials:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Or set environment variables:

```bash
set MYSQL_USERNAME=root
set MYSQL_PASSWORD=your_mysql_password
```

### Step 3: Run the Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**.

On first run, Hibernate will create the tables automatically, and `data.sql` will insert 10 sample parking spaces.

### Step 4: Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**.

### Step 5: Open the Application

Open your browser and visit: **http://localhost:5173**

---

## 🔌 REST API Endpoints

### Parking APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parking` | Get all parking spaces (with optional filters: location, vehicleType, status, search) |
| GET | `/api/parking/available` | Get available parking spaces |
| GET | `/api/parking/{id}` | Get a parking space by ID |
| POST | `/api/parking` | Create a new parking space |
| PUT | `/api/parking/{id}` | Update a parking space |
| DELETE | `/api/parking/{id}` | Delete a parking space |

### Reservation APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations` | Create a new reservation |
| GET | `/api/reservations` | Get all reservations (with optional filters: status, date) |
| GET | `/api/reservations/{id}` | Get a reservation by ID |
| GET | `/api/reservations/search?vehicleNumber=...` | Search reservations by vehicle number |
| PUT | `/api/reservations/{id}/cancel` | Cancel a reservation |

### Admin APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/statistics` | Get combined parking and reservation statistics |

---

## 🧪 Testing Guide

### Test Parking Reservations

1. Open http://localhost:5173
2. Click **View Parking Spaces**
3. Browse available spaces — green cards indicate available slots
4. Click **Reserve Now** on an available space
5. Fill in the form:
   - Name: John Doe
   - User Type: STUDENT
   - Vehicle Number: KA-01-AB-1234
   - Reservation Date: (select today or future date)
   - Start Time: 09:00
   - End Time: 12:00
6. Click **Confirm Reservation**
7. Note the Reservation ID from the success message

### Test Reservation Lookup

1. Go to **My Reservations**
2. Select "Search by Vehicle Number"
3. Enter: KA-01-AB-1234
4. Click **Search** — your reservation should appear

### Test Cancellation

1. From the reservation lookup results, click **Cancel** on an active reservation
2. Confirm the cancellation in the dialog
3. The reservation status changes to CANCELLED

### Test Admin Dashboard

1. Click **Admin Dashboard** in the navbar
2. View live statistics
3. Click **Manage Parking Spaces**:
   - Add a new space (e.g., D01, Block D, CAR)
   - Edit an existing space
   - Try deleting a space with an active reservation (should show error)
4. Click **Manage Reservations**:
   - Filter by status (ACTIVE, CANCELLED)
   - Cancel reservations from the admin panel

### Test Validation Rules

1. Try reserving a space for a past date — should show error
2. Try setting end time before start time — should show error
3. Try making two overlapping reservations for the same space — should show error
4. Try creating a parking space with a duplicate space number — should show error
5. Try deleting a parking space with an active reservation — should show error

---

## 📊 Sample Data

The application comes pre-loaded with 10 parking spaces:

| Space | Location | Vehicle Type | Status |
|-------|----------|-------------|--------|
| A01 | Block A | CAR | AVAILABLE |
| A02 | Block A | CAR | AVAILABLE |
| A03 | Block A | CAR | AVAILABLE |
| A04 | Block A | BIKE | AVAILABLE |
| B01 | Block B | CAR | AVAILABLE |
| B02 | Block B | CAR | OCCUPIED |
| B03 | Block B | BIKE | AVAILABLE |
| B04 | Block B | BIKE | AVAILABLE |
| C01 | Block C | CAR | AVAILABLE |
| C02 | Block C | BIKE | AVAILABLE |

---

## ⚠️ Limitations

1. **No Authentication**: This project has no login, registration, or password system. Anyone can access all features including the admin dashboard. This is intentional for a college demonstration.
2. **No Role-Based Access**: There is no distinction between user and admin roles — all pages are accessible to everyone.
3. **Single Server**: The application runs on a single backend server, not suitable for high-traffic production use.
4. **No Payment Integration**: No payment processing for parking fees.
5. **Local Development Only**: Configured for localhost development, not deployed to any cloud service.

---

## 🎓 For College Viva

Key topics you should be prepared to explain:

1. **MVC Architecture** — How Spring Boot separates Controller, Service, and Repository layers
2. **JPA/Hibernate** — How entity classes map to database tables
3. **REST APIs** — How the frontend communicates with the backend using HTTP methods
4. **React Components** — How UI is built using reusable components
5. **React Router** — How client-side routing works
6. **State Management** — How React useState and useEffect hooks work
7. **CORS** — Why cross-origin configuration is needed
8. **Reservation Validation** — How the backend validates overlapping reservations
9. **Foreign Keys** — The relationship between parking_spaces and reservations tables

---

## 📝 License

This project is created for educational purposes as a college project.
