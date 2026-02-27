"use client";

import {
  ClipboardList,
  Key,
  Package,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

const slides: {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Enter account information",
    description:
      "Request an account with the necessary information. Engineering Managers should select user type Admin and provide their project name as they would like it to appear in Juno.",
  },
  {
    step: "02",
    icon: ShieldCheck,
    title: "Await Infra approval",
    description:
      "Please contact the Infra team to approve your request for a new account.",
  },
  {
    step: "03",
    icon: Key,
    title: "Create a Juno API Key",
    description:
      "Engineering Managers create a Juno API Key to access all Juno services. Developers should request their Engineering Managers to add them to their project.",
  },
  {
    step: "04",
    icon: Package,
    title: "Install Juno SDK",
    description:
      "Install juno-sdk from NPM, provide API key, and access all Juno services!",
  },
];

export default function InstructionPanel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  function advance() {
    setCurrent((prev) => (prev + 1) % slides.length);
  }

  function goToSlide(index: number) {
    if (index === current) return;
    setCurrent(index);
  }

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center border-l border-white/10 bg-white/5 backdrop-blur-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 overflow-hidden bg-gradient-to-b from-white/8 to-transparent" />

      <div className="absolute left-0 top-[34%] z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        {slides.map((slide, index) => {
          const Icon = slide.icon;
          const isActive = index === current;
          return (
            <div key={index} className="flex flex-col items-center">
              {index > 0 && (
                <div className="h-12 w-0.5 overflow-hidden bg-white/15">
                  <div
                    className={`w-full bg-amber-400 ${
                      index <= current
                        ? "h-full"
                        : index === current + 1
                          ? "animate-progress-vertical"
                          : "h-0"
                    }`}
                    style={
                      index === current + 1 && paused
                        ? { animationPlayState: "paused" }
                        : undefined
                    }
                    onAnimationEnd={index === current + 1 ? advance : undefined}
                  />
                </div>
              )}

              <button
                onClick={() => goToSlide(index)}
                className={`relative flex h-12 w-12 items-center justify-center rounded-full border bg-neutral-900 shadow-lg transition-all duration-300 ease-out ${
                  isActive
                    ? "scale-125 border-amber-400/50"
                    : "scale-100 border-white/10 hover:border-white/20"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive
                      ? "text-amber-400 opacity-100"
                      : "text-white opacity-40"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          );
        })}
      </div>

      {current === slides.length - 1 && (
        <div className="absolute h-0 w-0 overflow-hidden">
          <div
            key={current}
            className="animate-progress-vertical"
            style={paused ? { animationPlayState: "paused" } : undefined}
            onAnimationEnd={advance}
          />
        </div>
      )}

      <div className="relative flex w-full flex-1 items-start pl-24 pr-16 pt-[15.125%]">
        <div key={current} className="flex flex-col items-start w-full">
          <span className="mb-6 animate-in fade-in slide-in-from-bottom-1 text-xl font-medium text-amber-400/60 duration-500 fill-mode-both">
            Onboarding Guide - Step {slides[current].step}
          </span>

          <h2 className="mb-6 animate-in fade-in slide-in-from-bottom-2 text-3xl font-bold tracking-tight text-white duration-500 delay-100 fill-mode-both">
            {slides[current].title}
          </h2>

          <p className="animate-in fade-in slide-in-from-bottom-3 leading-relaxed text-white/60 duration-500 delay-200 fill-mode-both whitespace-pre-line">
            {slides[current].description}
          </p>
        </div>
      </div>
    </div>
  );
}
