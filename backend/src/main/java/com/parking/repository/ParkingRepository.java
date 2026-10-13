package com.parking.repository;

import com.parking.entity.ParkingSpace;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParkingRepository extends JpaRepository<ParkingSpace, Long> {
    Optional<ParkingSpace> findBySpaceNumber(String spaceNumber);
    List<ParkingSpace> findByStatus(ParkingSpace.SpaceStatus status);
    List<ParkingSpace> findByLocation(String location);
    List<ParkingSpace> findByVehicleType(ParkingSpace.VehicleType vehicleType);
    boolean existsBySpaceNumber(String spaceNumber);
}
