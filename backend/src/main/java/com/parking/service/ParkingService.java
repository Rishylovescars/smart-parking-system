package com.parking.service;

import com.parking.entity.ParkingSpace;
import com.parking.repository.ParkingRepository;
import com.parking.repository.ReservationRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class ParkingService {

    private final ParkingRepository parkingRepository;
    private final ReservationRepository reservationRepository;

    public ParkingService(ParkingRepository parkingRepository, ReservationRepository reservationRepository) {
        this.parkingRepository = parkingRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<ParkingSpace> getAllParkingSpaces() {
        return parkingRepository.findAll();
    }

    public List<ParkingSpace> getAvailableParkingSpaces() {
        return parkingRepository.findByStatus(ParkingSpace.SpaceStatus.AVAILABLE);
    }

    public ParkingSpace getParkingSpaceById(Long id) {
        return parkingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Parking space not found with id: " + id));
    }

    public ParkingSpace createParkingSpace(ParkingSpace space) {
        if (space.getSpaceNumber() == null || space.getSpaceNumber().trim().isEmpty()) {
            throw new RuntimeException("Space number is required");
        }
        if (space.getLocation() == null || space.getLocation().trim().isEmpty()) {
            throw new RuntimeException("Location is required");
        }
        if (space.getVehicleType() == null) {
            throw new RuntimeException("Vehicle type is required");
        }

        if (parkingRepository.existsBySpaceNumber(space.getSpaceNumber())) {
            throw new RuntimeException("Parking space number '" + space.getSpaceNumber() + "' already exists");
        }

        if (space.getStatus() == null) {
            space.setStatus(ParkingSpace.SpaceStatus.AVAILABLE);
        }

        return parkingRepository.save(space);
    }

    public ParkingSpace updateParkingSpace(Long id, ParkingSpace space) {
        ParkingSpace existingSpace = getParkingSpaceById(id);

        if (space.getSpaceNumber() != null && !space.getSpaceNumber().trim().isEmpty()) {
            if (!existingSpace.getSpaceNumber().equalsIgnoreCase(space.getSpaceNumber())) {
                Optional<ParkingSpace> spaceWithNewNumber = parkingRepository.findBySpaceNumber(space.getSpaceNumber());
                if (spaceWithNewNumber.isPresent() && !spaceWithNewNumber.get().getId().equals(id)) {
                    throw new RuntimeException("Parking space number '" + space.getSpaceNumber() + "' is already in use");
                }
                existingSpace.setSpaceNumber(space.getSpaceNumber());
            }
        }

        if (space.getLocation() != null && !space.getLocation().trim().isEmpty()) {
            existingSpace.setLocation(space.getLocation());
        }

        if (space.getVehicleType() != null) {
            existingSpace.setVehicleType(space.getVehicleType());
        }

        if (space.getStatus() != null) {
            existingSpace.setStatus(space.getStatus());
        }

        return parkingRepository.save(existingSpace);
    }

    public void deleteParkingSpace(Long id) {
        ParkingSpace existingSpace = getParkingSpaceById(id);

        if (reservationRepository.hasActiveReservations(id)) {
            throw new RuntimeException("Cannot delete parking space " + existingSpace.getSpaceNumber() + " because it has active reservations");
        }

        parkingRepository.delete(existingSpace);
    }

    public Map<String, Object> getStatistics() {
        long totalSpaces = parkingRepository.count();
        long availableSpaces = parkingRepository.findByStatus(ParkingSpace.SpaceStatus.AVAILABLE).size();
        long occupiedSpaces = parkingRepository.findByStatus(ParkingSpace.SpaceStatus.OCCUPIED).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpaces", totalSpaces);
        stats.put("availableSpaces", availableSpaces);
        stats.put("occupiedSpaces", occupiedSpaces);
        return stats;
    }
}
