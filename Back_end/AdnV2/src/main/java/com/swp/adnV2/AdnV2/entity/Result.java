package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Result")
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Column(name = "result_date")
    private LocalDate resultDate;

    @Column(name = "result_data", columnDefinition = "NVARCHAR(255)")
    private String resultData;

    @Column(name = "interpretation", columnDefinition = "NVARCHAR(MAX)")
    private String interpretation;

    @Column(name = "status", columnDefinition = "NVARCHAR(20) DEFAULT 'Pending'")
    private String status = "Pending";

    @Column(name = "result_file", columnDefinition = "NVARCHAR(255)")
    private String resultFile;

    @OneToMany
    @JoinColumn(name = "sample_id")
    private List<CollectedSample> collectedSample;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @OneToOne
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    // Default constructor
    public Result() {
    }

    // Getters and setters
    public Long getResultId() {
        return resultId;
    }

    public void setResultId(Long resultId) {
        this.resultId = resultId;
    }

    public LocalDate getResultDate() {
        return resultDate;
    }

    public void setResultDate(LocalDate resultDate) {
        this.resultDate = resultDate;
    }

    public String getResultData() {
        return resultData;
    }

    public void setResultData(String resultData) {
        this.resultData = resultData;
    }

    public String getInterpretation() {
        return interpretation;
    }

    public void setInterpretation(String interpretation) {
        this.interpretation = interpretation;
    }

    public List<CollectedSample> getCollectedSample() {
        return collectedSample;
    }

    public void setCollectedSample(List<CollectedSample> collectedSample) {
        this.collectedSample = collectedSample;
    }

    public Users getUser() {
        return users;
    }

    public void setUser(Users users) {
        this.users = users;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResultFile() {
        return resultFile;
    }
    public void setResultFile(String resultFile) {
        this.resultFile = resultFile;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public Users getUsers() {
        return users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    @Override
    public String toString() {
        return "Result{" +
                "resultId=" + resultId +
                ", resultDate=" + resultDate +
                ", resultData='" + resultData + '\'' +
                ", interpretation='" + interpretation + '\'' +
                ", sample=" + collectedSample +
                ", user=" + users +
                ", status='" + status + '\'' +
                ", appointment=" + appointment +
                ", resultFile='" + resultFile + '\'' +
                '}';
    }
}
