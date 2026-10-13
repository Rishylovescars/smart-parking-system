package com.parking.repository;

import com.parking.entity.Reservation;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByVehicleNumberIgnoreCase(String vehicleNumber);
    List<Reservation> findByStatus(Reservation.ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.parkingSpace.id = :spaceId AND r.reservationDate = :date AND r.status = 'ACTIVE' AND ((r.startTime < :endTime AND r.endTime > :startTime))")
    List<Reservation> findOverlappingReservations(@Param("spaceId") Long spaceId,
                                                 @Param("date") LocalDate date,
                                                 @Param("startTime") LocalTime startTime,
                                                 @Param("endTime") LocalTime endTime);

    long countByStatus(Reservation.ReservationStatus status);

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.parkingSpace.id = :spaceId AND r.status = 'ACTIVE'")
    boolean hasActiveReservations(@Param("spaceId") Long spaceId);
}
