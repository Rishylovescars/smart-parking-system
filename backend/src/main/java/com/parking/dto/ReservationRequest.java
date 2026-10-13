package com.parking.dto;

public class ReservationRequest {

    private String name;
    private String userType; // STUDENT, FACULTY
    private String vehicleNumber;
    private String vehicleType; // CAR, BIKE
    private Long parkingSpaceId;
    private String reservationDate; // yyyy-MM-dd
    private String startTime; // HH:mm
    private String endTime; // HH:mm

    public ReservationRequest() {
    }

    public ReservationRequest(String name, String userType, String vehicleNumber, String vehicleType,
                              Long parkingSpaceId, String reservationDate, String startTime, String endTime) {
        this.name = name;
        this.userType = userType;
        this.vehicleNumber = vehicleNumber;
        this.vehicleType = vehicleType;
        this.parkingSpaceId = parkingSpaceId;
        this.reservationDate = reservationDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public Long getParkingSpaceId() {
        return parkingSpaceId;
    }

    public void setParkingSpaceId(Long parkingSpaceId) {
        this.parkingSpaceId = parkingSpaceId;
    }

    public String getReservationDate() {
        return reservationDate;
    }

    public void setReservationDate(String reservationDate) {
        this.reservationDate = reservationDate;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }
}
