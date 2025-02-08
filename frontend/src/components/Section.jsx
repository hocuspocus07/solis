import React from "react";
import heroImage from "../assets/heroImage.png";
import page2 from "../assets/page2.png";

export function Section() {
  return (
    <div className="w-screen h-screen">
  {/* Hero Image Section */}
  <section className="w-full h-screen flex justify-center items-center overflow-x-hidden">
    <img src={heroImage} alt="Hero Section" className="w-full h-full object-cover" />
  </section>

      {/* Page 2 Image Section */}
      <section className="w-full h-screen flex justify-center items-center snap-start">
        <img src={page2} alt="Page 2 Section" className="w-full h-full object-cover" />
        
      </section>
    </div>
  );
}
