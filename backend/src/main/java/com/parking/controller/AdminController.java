package com.parking.controller;

import com.parking.service.ParkingService;
import com.parking.service.ReservationService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final ParkingService parkingService;
    private final ReservationService reservationService;

    public AdminController(ParkingService parkingService, ReservationService reservationService) {
        this.parkingService = parkingService;
        this.reservationService = reservationService;
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getCombinedStatistics() {
        Map<String, Object> parkingStats = parkingService.getStatistics();
        Map<String, Object> reservationStats = reservationService.getStatistics();

        Map<String, Object> combined = new HashMap<>();
        combined.putAll(parkingStats);
        combined.putAll(reservationStats);

        return ResponseEntity.ok(combined);
    }
}
