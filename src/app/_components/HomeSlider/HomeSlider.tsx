"use client";
import React from "react";
import img1 from "../../../../assets/images/1.jpg";
import img2 from "../../../../assets/images/2.jpg";
import img3 from "../../../../assets/images/3.jpg";
import img4 from "../../../../assets/images/4.jpg";
import img5 from "../../../../assets/images/5.jpg";
import img6 from "../../../../assets/images/6.jpg";
import Image from "next/image";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Swiper styles
import "swiper/css";

export default function HomeSlider() {
  return (
    <div className="container w-[80%] mx-auto flex my-12">

   
      <div className="w-3/4">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          <SwiperSlide>
            <Image
              src={img2}
              alt="slide 1"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>

          <SwiperSlide>
            <Image
              src={img3}
              alt="slide 2"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>

          <SwiperSlide>
            <Image
              src={img6}
              alt="slide 3"
              className="w-full h-[400px] object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

  
      <div className="w-1/4 flex flex-col">
        <Image
          src={img4}
          alt="small image 1"
          className="w-full h-[190px] object-cover"
        />
        <Image
          src={img5}
          alt="small image 2"
          className="w-full h-[210px] object-cover"
        />
      </div>

    </div>
  );
}