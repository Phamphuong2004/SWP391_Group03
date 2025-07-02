package com.swp.adnV2.AdnV2.entity;

public enum TestPurpose {
    HANH_CHINH("Hành chính"),
    DAN_SU("Dân sự"),
    OTHER("Khác");

    private final String displayName;

    TestPurpose(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName(){
        return displayName;
    }

    public static TestPurpose fromDisplayName(String displayName){
        for (TestPurpose purpose : TestPurpose.values()){
            if(purpose.displayName.equalsIgnoreCase(displayName)){
                return purpose;
            }
        }
        return OTHER;
    }
}
