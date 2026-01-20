import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CategoryShowcase from "./components/CategoryShowcase";
import LatestPosts from "./components/LatestPosts";
import FeaturedSection from "./components/FeaturedSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="w-full px-4 pt-6 pb-12">
        <Hero />
      </div>

      <section className="py-12  backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">
              หมวดหมู่ยอดนิยม
            </h2>
            <p className="text-white/70 max-w-full mx-auto">
              สำรวจคอนเทนต์ที่คุณชื่นชอบ ตั้งแต่อนิเมะมาใหม่
              ไปจนถึงรีวิววิชวลโนเวลและไลท์โนเวล
            </p>
          </div>
          <CategoryShowcase />
        </div>
      </section>

      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">บทความล่าสุด</h2>
            <p className="text-white/70 max-w-full mx-auto">
              อัพเดทข่าวสารล่าสุดกับรีวิวอนิเมะ เกมเพลย์วิชวลโนเวล
              และสรุปเนื้อหาไลท์โนเวล
            </p>
          </div>
          <LatestPosts />
        </div>
      </section>

      <section className="py-16  backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">
              ไฮไลท์ประจำสัปดาห์
            </h2>
            <p className="text-white/70 max-w-full mx-auto">
              คอนเทนต์สุดพิเศษที่คัดสรรโดยทีมบรรณาธิการของเรา
              จากทั้งวงการอนิเมะและวิชวลโนเวล
            </p>
          </div>
          <FeaturedSection />
        </div>
      </section>
    </div>
  );
}
