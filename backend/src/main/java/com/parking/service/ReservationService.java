package com.parking.service;

import com.parking.dto.ReservationRequest;
import com.parking.entity.ParkingSpace;
import com.parking.entity.Reservation;
import com.parking.repository.ParkingRepository;
import com.parking.repository.ReservationRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ParkingRepository parkingRepository;

    public ReservationService(ReservationRepository reservationRepository, ParkingRepository parkingRepository) {
        this.reservationRepository = reservationRepository;
        this.parkingRepository = parkingRepository;
    }

    public Reservation createReservation(ReservationRequest request) {
        // 1. All fields required validation
        if (request == null) {
            throw new RuntimeException("Reservation request cannot be null");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getUserType() == null || request.getUserType().trim().isEmpty()) {
            throw new RuntimeException("User type is required (STUDENT or FACULTY)");
        }
        if (request.getVehicleNumber() == null || request.getVehicleNumber().trim().isEmpty()) {
            throw new RuntimeException("Vehicle number is required");
        }
        if (request.getVehicleType() == null || request.getVehicleType().trim().isEmpty()) {
            throw new RuntimeException("Vehicle type is required (CAR or BIKE)");
        }
        if (request.getParkingSpaceId() == null) {
            throw new RuntimeException("Parking space ID is required");
        }
        if (request.getReservationDate() == null || request.getReservationDate().trim().isEmpty()) {
            throw new RuntimeException("Reservation date is required (yyyy-MM-dd)");
        }
        if (request.getStartTime() == null || request.getStartTime().trim().isEmpty()) {
            throw new RuntimeException("Start time is required (HH:mm)");
        }
        if (request.getEndTime() == null || request.getEndTime().trim().isEmpty()) {
            throw new RuntimeException("End time is required (HH:mm)");
        }

        // Parse userType and vehicleType enums
        Reservation.UserType userType;
        try {
            userType = Reservation.UserType.valueOf(request.getUserType().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid user type: " + request.getUserType() + ". Allowed: STUDENT, FACULTY");
        }

        ParkingSpace.VehicleType vehicleType;
        try {
            vehicleType = ParkingSpace.VehicleType.valueOf(request.getVehicleType().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid vehicle type: " + request.getVehicleType() + ". Allowed: CAR, BIKE");
        }

        // 2. Parse date/time
        LocalDate date;
        try {
            date = LocalDate.parse(request.getReservationDate().trim());
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid reservation date format. Expected yyyy-MM-dd: " + request.getReservationDate());
        }

        LocalTime startTime;
        try {
            startTime = LocalTime.parse(request.getStartTime().trim());
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid start time format. Expected HH:mm: " + request.getStartTime());
        }

        LocalTime endTime;
        try {
            endTime = LocalTime.parse(request.getEndTime().trim());
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid end time format. Expected HH:mm: " + request.getEndTime());
        }

        // 3. Parking space must exist
        ParkingSpace parkingSpace = parkingRepository.findById(request.getParkingSpaceId())
                .orElseThrow(() -> new RuntimeException("Parking space not found with id: " + request.getParkingSpaceId()));

        // 4. Date cannot be in the past
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            throw new RuntimeException("Reservation date cannot be in the past");
        }

        // If today, start time cannot be in the past
        if (date.isEqual(today) && startTime.isBefore(LocalTime.now())) {
            throw new RuntimeException("Start time cannot be in the past for today's reservation");
        }

        // 5. End time must be after start time
        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException("End time must be after start time");
        }

        // 6. Vehicle type must match parking space type
        if (parkingSpace.getVehicleType() != vehicleType) {
            throw new RuntimeException("Vehicle type (" + vehicleType + ") does not match parking space vehicle type (" + parkingSpace.getVehicleType() + ")");
        }

        // 7. Parking space status must be AVAILABLE
        if (parkingSpace.getStatus() != ParkingSpace.SpaceStatus.AVAILABLE) {
            throw new RuntimeException("Parking space " + parkingSpace.getSpaceNumber() + " is currently OCCUPIED or unavailable");
        }

        // 8. No overlapping ACTIVE reservations
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                parkingSpace.getId(),
                date,
                startTime,
                endTime
        );
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Parking space " + parkingSpace.getSpaceNumber() + " has an overlapping active reservation for the specified time slot");
        }

        // Build and save reservation
        Reservation reservation = new Reservation();
        reservation.setName(request.getName().trim());
        reservation.setUserType(userType);
        reservation.setVehicleNumber(request.getVehicleNumber().trim());
        reservation.setVehicleType(vehicleType);
        reservation.setParkingSpace(parkingSpace);
        reservation.setReservationDate(date);
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setStatus(Reservation.ReservationStatus.ACTIVE);

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    public Reservation getReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
    }

    public List<Reservation> searchByVehicleNumber(String vehicleNumber) {
        if (vehicleNumber == null || vehicleNumber.trim().isEmpty()) {
            return getAllReservations();
        }
        return reservationRepository.findByVehicleNumberIgnoreCase(vehicleNumber.trim());
    }

    public Reservation cancelReservation(Long id) {
        Reservation reservation = getReservationById(id);
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }

    public Map<String, Object> getStatistics() {
        long totalReservations = reservationRepository.count();
        long activeReservations = reservationRepository.countByStatus(Reservation.ReservationStatus.ACTIVE);
        long cancelledReservations = reservationRepository.countByStatus(Reservation.ReservationStatus.CANCELLED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReservations", totalReservations);
        stats.put("activeReservations", activeReservations);
        stats.put("cancelledReservations", cancelledReservations);
        return stats;
    }
}
