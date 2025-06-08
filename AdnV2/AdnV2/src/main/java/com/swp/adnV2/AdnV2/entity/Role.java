package com.swp.adnV2.AdnV2.entity;

public enum Role {
    GUEST("Guest"),
    CUSTOMER("Customer"),
    STAFF("Staff"),
    MANAGER("Manager"),
    ADMIN("Admin");

    private final String value;

    Role(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Role fromValue(String value) {
        for (Role role : values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown role: " + value);
    }
}
