package com.swp.adnV2.AdnV2.dto;

public class FeedbackRequest {
    private String content;
    private int rating;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
