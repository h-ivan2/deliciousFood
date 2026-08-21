"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import { Logo } from "./index";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, hsl(var(--foreground)) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, hsl(var(--foreground)) 1%, transparent);
  --pill-shadow: color-mix(in oklch, hsl(var(--background)) 50%, transparent);
  --pill-highlight: color-mix(in oklch, hsl(var(--foreground)) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, hsl(var(--background)) 80%, transparent);
  --pill-border: color-mix(in oklch, hsl(var(--foreground)) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, hsl(var(--foreground)) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, hsl(var(--foreground)) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, hsl(var(--foreground)) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, hsl(var(--background)) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, hsl(var(--foreground)) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, hsl(var(--destructive)) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, hsl(var(--destructive)) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, hsl(var(--foreground)) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, hsl(var(--primary)) 15%, transparent) 0%,
    color-mix(in oklch, hsl(var(--secondary)) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: hsl(var(--foreground));
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, hsl(var(--foreground)) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, hsl(var(--foreground)) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, hsl(var(--foreground)) 0%, color-mix(in oklch, hsl(var(--foreground)) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, hsl(var(--foreground)) 15%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
function MagneticButton({ className, children, as: Component = "button", ...props }) {
  const localRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const element = localRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const h = rect.width / 2;
        const w = rect.height / 2;
        const x = e.clientX - rect.left - h;
        const y = e.clientY - rect.top - w;

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.4,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1.2,
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, element);

    return () => ctx.revert();
  }, []);

  return (
    <Component
      ref={localRef}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

const FOOTER_COLS = [
  { title: 'Platform', links: [
    { label: 'Features',    to: '/explore' },
    { label: 'Restaurants', to: '/browse' },
    { label: 'Pricing',     to: '/' },
    { label: 'About',       to: '/' },
  ]},
  { title: 'Company', links: [
    { label: 'Blog',     to: '/' },
    { label: 'Careers',  to: '/' },
    { label: 'Press',    to: '/' },
    { label: 'Contact',  to: '/' },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacy',       to: '/' },
    { label: 'Terms',         to: '/' },
    { label: 'Cookie Policy', to: '/' },
    { label: 'Licenses',      to: '/' },
  ]},
];

const SOCIAL = [
  { icon: <Twitter size={16} />,   label: 'Twitter',   href: 'https://twitter.com' },
  { icon: <Instagram size={16} />, label: 'Instagram',  href: 'https://instagram.com' },
  { icon: <Linkedin size={16} />,  label: 'LinkedIn',   href: 'https://linkedin.com' },
  { icon: <Facebook size={16} />,  label: 'Facebook',   href: 'https://facebook.com' },
];

// -------------------------------------------------------------------------
// 3. MARQUEE ITEM
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span>Good Food</span> <span className="text-primary/60">✦</span>
    <span>Good Mood</span> <span className="text-secondary/60">✦</span>
    <span>Restaurant Management</span> <span className="text-primary/60">✦</span>
    <span>Easy Ordering</span> <span className="text-secondary/60">✦</span>
    <span>Real-Time Tracking</span> <span className="text-primary/60">✦</span>
    <span>Power Your Business</span> <span className="text-secondary/60">✦</span>
  </div>
);

// -------------------------------------------------------------------------
// 4. MAIN COMPONENT
// -------------------------------------------------------------------------
export default function CinematicFooter() {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">

          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[5vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none"
          >
            DELICIOUS FOOD
          </div>

          {/* 1. Marquee */}
          <div className="absolute top-12 left-0 w-full overflow-hidden border-y border-border/50 bg-background/60 backdrop-blur-md py-4 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-5xl md:text-8xl font-black footer-text-glow tracking-tighter mb-8 text-center"
            >
              Powering Restaurants.
            </h2>

            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Footer columns */}
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 w-full mb-4">
                {FOOTER_COLS.map((col) => (
                  <div key={col.title} className="text-center">
                    <div className="text-accent font-bold text-sm mb-4 uppercase tracking-widest">{col.title}</div>
                    {col.links.map((link) => (
                      <div
                        key={link.label}
                        className="text-sm mb-2.5 cursor-pointer transition-colors duration-200 hover:text-accent text-muted-foreground"
                        onClick={() => {
                          if (link.to) navigate(link.to);
                        }}
                      >
                        {link.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Social + Logo */}
              <div className="flex flex-col items-center gap-4">
                <Logo size="sm" />
              </div>

              {/* Secondary Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-6 w-full mt-2">
                <MagneticButton as="a" onClick={() => navigate('/')} className="footer-glass-pill px-6 py-3 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground">
                  Privacy Policy
                </MagneticButton>
                <MagneticButton as="a" onClick={() => navigate('/')} className="footer-glass-pill px-6 py-3 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground">
                  Terms of Service
                </MagneticButton>
                <MagneticButton as="a" href="#" onClick={(e) => { e.preventDefault(); navigate('/settings'); }} className="footer-glass-pill px-6 py-3 rounded-full text-muted-foreground font-medium text-xs md:text-sm hover:text-foreground">
                  Support
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Copyright */}
            <div className="text-muted-foreground text-[10px] md:text-xs font-semibold tracking-widest uppercase order-2 md:order-1">
              &copy; 2025 Delicious Food. All rights reserved.
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 order-1 md:order-2">
              {SOCIAL.map(({ icon, label, href }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground"
                >
                  {icon}
                </MagneticButton>
              ))}
            </div>

            {/* Made with Love */}
            <div className="footer-glass-pill px-6 py-3 rounded-full flex items-center gap-2 order-1 md:order-3 cursor-default border-border/50">
              <span className="text-muted-foreground text-[10px] md:text-xs font-bold uppercase tracking-widest">Made with</span>
              <span className="animate-footer-heartbeat text-sm md:text-base text-destructive">&hearts;</span>
              <span className="text-foreground font-black text-xs md:text-sm tracking-normal ml-1">Delicious Food</span>
            </div>

            {/* Back to top */}
            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-4"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>

          </div>
        </footer>
      </div>
    </>
  );
}
