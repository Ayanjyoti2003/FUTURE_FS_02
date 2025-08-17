"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image"; // ✅ use Next.js Image
import fashion2 from "../assets/fashion2.png";
import electronics2 from "../assets/electronics2.png";
import sale from "../assets/sale3.png";

import "swiper/css";
import "swiper/css/pagination";

export default function HeroSlider() {
    return (
        <section className="relative rounded-xl overflow-hidden shadow-lg">
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                pagination={{
                    clickable: true,
                    renderBullet: (_, className) =>
                        `<span class="${className} w-3 h-3 rounded-full !bg-purple-500 opacity-60 transition-all duration-300 
                        [&.swiper-pagination-bullet-active]:!bg-purple-700 
                        [&.swiper-pagination-bullet-active]:opacity-100 
                        [&.swiper-pagination-bullet-active]:scale-125"></span>`,
                }}
                className="w-full h-[240px]"
            >
                <SwiperSlide>
                    <Image
                        src={electronics2}
                        alt="Electronics banner"
                        fill
                        className="object-cover"
                        priority
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src={sale}
                        alt="Sale banner"
                        fill
                        className="object-cover"
                    />
                </SwiperSlide>
                <SwiperSlide>
                    <Image
                        src={fashion2}
                        alt="Fashion banner"
                        fill
                        className="object-cover"
                    />
                </SwiperSlide>
            </Swiper>
        </section>
    );
}
