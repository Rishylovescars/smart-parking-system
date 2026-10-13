package com.parking.controller;

import com.parking.entity.ParkingSpace;
import com.parking.service.ParkingService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/parking")
@CrossOrigin(origins = "*")
public class ParkingController {

    private final ParkingService parkingService;

    public ParkingController(ParkingService parkingService) {
        this.parkingService = parkingService;
    }

    @GetMapping
    public ResponseEntity<List<ParkingSpace>> getAllParkingSpaces(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String vehicleType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<ParkingSpace> spaces = parkingService.getAllParkingSpaces();

        if (location != null && !location.trim().isEmpty()) {
            spaces = spaces.stream()
                    .filter(s -> s.getLocation() != null && s.getLocation().equalsIgnoreCase(location.trim()))
                    .collect(Collectors.toList());
        }

        if (vehicleType != null && !vehicleType.trim().isEmpty()) {
            spaces = spaces.stream()
                    .filter(s -> s.getVehicleType() != null && s.getVehicleType().name().equalsIgnoreCase(vehicleType.trim()))
                    .collect(Collectors.toList());
        }

        if (status != null && !status.trim().isEmpty()) {
            spaces = spaces.stream()
                    .filter(s -> s.getStatus() != null && s.getStatus().name().equalsIgnoreCase(status.trim()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String query = search.trim().toLowerCase();
            spaces = spaces.stream()
                    .filter(s -> (s.getSpaceNumber() != null && s.getSpaceNumber().toLowerCase().contains(query))
                            || (s.getLocation() != null && s.getLocation().toLowerCase().contains(query)))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(spaces);
    }

    @GetMapping("/available")
    public ResponseEntity<List<ParkingSpace>> getAvailableParkingSpaces() {
        return ResponseEntity.ok(parkingService.getAvailableParkingSpaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParkingSpace> getParkingSpaceById(@PathVariable Long id) {
        return ResponseEntity.ok(parkingService.getParkingSpaceById(id));
    }

    @PostMapping
    public ResponseEntity<ParkingSpace> createParkingSpace(@RequestBody ParkingSpace space) {
        ParkingSpace created = parkingService.createParkingSpace(space);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpace> updateParkingSpace(@PathVariable Long id, @RequestBody ParkingSpace space) {
        return ResponseEntity.ok(parkingService.updateParkingSpace(id, space));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParkingSpace(@PathVariable Long id) {
        parkingService.deleteParkingSpace(id);
        return ResponseEntity.ok().build();
    }
}
