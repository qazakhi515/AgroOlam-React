import React from "react";
import QuickServicesStrip from "./QuickServicesStrip";
import AiScannerSection from "./AiScannerSection";
import AgroStoreSection from "./AgroStoreSection";
import ServicesSection from "./ServicesSection";
import GlobalProjectsMap from "./GlobalProjectsMap";
import FarmerTestimonialCarousel from "./FarmerTestimonialCarousel";
import FarmerConsultationSection from "./FarmerConsultationSection";
import { CartItem } from "../../../lib/types/search";
import "../../../css/home.css";

interface HomePageProps {
  onAdd?: (item: CartItem) => void;
}

export default function HomePage({ onAdd = () => {} }: HomePageProps) {
  return (
    <div className={"homepage"}>
      {/* 1. Quick Services Category Strip (4 Pills) */}
      <QuickServicesStrip />

      {/* 2. AgroOlam Vision AI 4.1 Leaf Scanner Workbench (Double-Mode) */}
      <AiScannerSection onAdd={onAdd} />

      {/* 3. Official Agro Store & Certified Product Catalog */}
      <AgroStoreSection onAdd={onAdd} />

      {/* 4. Agronomic Engineering & Modern Services */}
      <ServicesSection />

      {/* 5. Global Projects Map & Statistics */}
      <GlobalProjectsMap />

      {/* 6. Dynamic 3D Farmer Testimonials Carousel (High-Trust Proof) */}
      <FarmerTestimonialCarousel />

      {/* 7. 15-Minute Free Consultation Form */}
      <FarmerConsultationSection />
    </div>
  );
}
