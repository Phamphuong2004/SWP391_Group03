import React from "react";
import activities from "../ADNActivites";
import "./ADNTestingActivities.css";
// Add Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

export default function ADNTestingActivities() {
  return (
    <div className="adn-activities-banner adn-activities-animated">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        spaceBetween={0}
        slidesPerView={1}
        className="adn-activities-banner-swiper"
      >
        {activities.map((act) => (
          <SwiperSlide key={act.id}>
            <img
              src={act.image}
              className="adn-banner-image"
              alt={act.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
