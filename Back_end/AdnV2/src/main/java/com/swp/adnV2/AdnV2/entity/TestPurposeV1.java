package com.swp.adnV2.AdnV2.entity;

public enum TestPurposeV1 {
    HANH_CHINH("Hành chính"),
    DAN_SU("Dân sự"),
    OTHER("Khác");

    private final String displayName;

    TestPurposeV1(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName(){
        return displayName;
    }

    public static TestPurposeV1 fromDisplayName(String displayName){
        for (TestPurposeV1 purpose : TestPurposeV1.values()){
            if(purpose.displayName.equalsIgnoreCase(displayName)){
                return purpose;
            }
        }
        return OTHER;
    }
}