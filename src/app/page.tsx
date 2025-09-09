"use client";
import React, { useState, useEffect, useRef } from "react";
import "./globals.css";
import NavBar from '@/components/LandingPage/navbar';
import Footer from "@/components/LandingPage/footer";
import Form from "@/components/LandingPage/form";

interface Slide {
  title: string;
  description: string;
  icon: string;
}

const slides: Slide[] = [
  {
    title: "Answer Questions",
    description: "Answer guided YES/NO questions about your child's symptoms.",
    icon: "https://static.thenounproject.com/png/question-icon-7788427-512.png",
  },
  {
    title: "AI Risk Analysis",
    description: "AI analyzes the answers and detects possible genetic risk patterns.",
    icon: "https://static.thenounproject.com/png/finance-ai-analysis-icon-7933020-512.png",
  },
  {
    title: "Receive Summary",
    description:
      "Get a risk indicator and concise summary with potential genetic disorders.",
    icon: "https://static.thenounproject.com/png/data-analysis-icon-7976775-512.png",
  },
];



export default function Home() {
  const [active, setActive] = useState(1);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // const scrollToForm = () => {
  //   formRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <>
      <NavBar />
      <div className={"dw-container"}>
        <h1 className={"dw-title"}>
          Harness the Power of AI for Genetic Risk Assessment
        </h1>
        <p className={"dw-subtitle"}>
          From answering a few questions to receiving a detailed report — all in one
          simple chatbot experience.
        </p>

        <div ref={formRef}>
          <Form />
        </div>

        <div className={"dw-carousel"}>
          {slides.map((slide, index) => {
            let cardClass = "dw-card-hidden";

            if (index === active) cardClass = "dw-card-active";
            else if (index === (active - 1 + slides.length) % slides.length)
              cardClass = "dw-card-prev";
            else if (index === (active + 1) % slides.length)
              cardClass = "dw-card-next";

            return (
              <div key={index} className={`${"dw-card"} ${cardClass}`}>
                <div className={"dw-card-image"}>
                  <img
                    src={slide.icon}
                    alt={slide.title}
                    className={"slide-icon"}
                  />
                </div>
                <h3>{slide.title}</h3>
                <p>{slide.description}</p>
              </div>
            );
          })}
        </div>

        <div className={"dw-dots"}>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === active ? "active" : ""}`}
              onClick={() => setActive(i)}
            />

          ))}
        </div>
        <Footer />
      </div >
    </>
  );
}
