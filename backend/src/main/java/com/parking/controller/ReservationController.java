package com.parking.controller;

import com.parking.dto.ReservationRequest;
import com.parking.entity.Reservation;
import com.parking.service.ReservationService;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationRequest request) {
        Reservation created = reservationService.createReservation(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date) {

        List<Reservation> reservations = reservationService.getAllReservations();

        if (status != null && !status.trim().isEmpty()) {
            reservations = reservations.stream()
                    .filter(r -> r.getStatus() != null && r.getStatus().name().equalsIgnoreCase(status.trim()))
                    .collect(Collectors.toList());
        }

        if (date != null && !date.trim().isEmpty()) {
            LocalDate filterDate = LocalDate.parse(date.trim());
            reservations = reservations.stream()
                    .filter(r -> r.getReservationDate() != null && r.getReservationDate().isEqual(filterDate))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Reservation>> searchByVehicleNumber(@RequestParam(required = false) String vehicleNumber) {
        return ResponseEntity.ok(reservationService.searchByVehicleNumber(vehicleNumber));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }
}
