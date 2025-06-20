package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

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

    @ManyToOne
    @JoinColumn(name = "sample_id")
    private Sample sample;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

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

    public Sample getSample() {
        return sample;
    }

    public void setSample(Sample sample) {
        this.sample = sample;
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

    @Override
    public String toString() {
        return "Result{" +
                "resultId=" + resultId +
                ", resultDate=" + resultDate +
                ", resultData='" + resultData + '\'' +
                ", interpretation='" + interpretation + '\'' +
                ", sample=" + sample +
                ", user=" + users +
                ", status='" + status + '\'' +
                '}';
    }
}
