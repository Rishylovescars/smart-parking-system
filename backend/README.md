# Smart Parking Management System - Backend

Spring Boot 3 backend application for Smart Parking Management System.

## Technology Stack
- Java 17
- Spring Boot 3.2.0 (Web, Data JPA, Validation)
- MySQL Connector / MySQL Database
- Maven

## Database Setup
Ensure MySQL is running on `localhost:3306`.
By default, the application connects using:
- **Database URL**: `jdbc:mysql://localhost:3306/parking_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`
- **Username**: `${MYSQL_USERNAME:root}`
- **Password**: `${MYSQL_PASSWORD:}`

Initial parking spaces seed data will be automatically inserted on start from `src/main/resources/data.sql`.

## Build and Run

### Prerequisites
- Java 17 JDK installed and configured on your `PATH`.
- Maven 3.8+ installed (or configure Maven wrapper with `mvn -N wrapper:wrapper -Dmaven=3.9.6`).

### Commands
```bash
# Clean and compile
mvn clean compile

# Run application
mvn spring-boot:run
```

The server will start on port `8080`.

## API Endpoints Overview

### Parking Spaces (`/api/parking`)
- `GET /api/parking` - List all parking spaces (supports query params `location`, `vehicleType`, `status`, `search`)
- `GET /api/parking/available` - List all available parking spaces
- `GET /api/parking/{id}` - Get parking space by ID
- `POST /api/parking` - Create a new parking space
- `PUT /api/parking/{id}` - Update a parking space
- `DELETE /api/parking/{id}` - Delete a parking space (blocked if active reservations exist)

### Reservations (`/api/reservations`)
- `POST /api/reservations` - Create a new reservation with conflict & validation checks
- `GET /api/reservations` - List all reservations (supports query params `status`, `date`)
- `GET /api/reservations/{id}` - Get reservation by ID
- `GET /api/reservations/search?vehicleNumber=...` - Search reservations by vehicle number
- `PUT /api/reservations/{id}/cancel` - Cancel a reservation

### Admin (`/api/admin`)
- `GET /api/admin/statistics` - Combined statistics for spaces and reservations
