package com.swp.adnV2.AdnV2.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "KitComponents")
public class KitComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kit_component_id")
    private Long kitComponentId;

    @Column(name = "component_name", columnDefinition = "NVARCHAR(100)")
    private String componentName;

    @Column(name = "quantity", columnDefinition = "INT DEFAULT 1")
    private int quantity;

    @Column(name = "instruction", columnDefinition = "NVARCHAR(255)")
    private String instruction;

    // Thay đổi từ @OneToOne sang @ManyToOne
    // Xóa bỏ unique=true để cho phép nhiều KitComponent liên kết với cùng một Service
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Services service;

    public KitComponent() {
    }

    public KitComponent(Long kitComponentId, String componentName, int quantity, String intrustions, Services service) {
        this.kitComponentId = kitComponentId;
        this.componentName = componentName;
        this.quantity = quantity;
        this.instruction = intrustions;
        this.service = service;
    }

    public Long getKitComponentId() {
        return kitComponentId;
    }

    public void setKitComponentId(Long kitComponentId) {
        this.kitComponentId = kitComponentId;
    }

    public String getComponentName() {
        return componentName;
    }

    public void setComponentName(String componentName) {
        this.componentName = componentName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getIntructions() {
        return instruction;
    }

    public void setIntructions(String intrustions) {
        this.instruction = intrustions;
    }

    public Services getService() {
        return service;
    }

    public void setService(Services service) {
        this.service = service;
    }

    @Override
    public String toString() {
        return "KitComponent{" +
                "kitComponentId=" + kitComponentId +
                ", componentName='" + componentName + '\'' +
                ", quantity=" + quantity +
                ", intrustions='" + instruction + '\'' +
                ", service=" + service +
                '}';
    }
}
