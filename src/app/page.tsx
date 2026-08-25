"use client";

import { LazyMotion, domMax } from "framer-motion";
import { LanguageProvider } from "@/i18n";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import SkillsMap from "@/components/SkillsMap";
import ProjectsLab from "@/components/ProjectsLab";
import HowIThink from "@/components/HowIThink";
import BuildWithMe from "@/components/BuildWithMe";
import Journey from "@/components/Journey";
import PortfolioArchitecture from "@/components/PortfolioArchitecture";
import Contact from "@/components/Contact";
import ChatWidget from "@/components/chat/ChatWidget";
import VisitorModal, { ModeBadge } from "@/components/VisitorModal";
import SignalSpine from "@/components/SignalSpine";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <LanguageProvider>
      <LazyMotion features={domMax} strict>
        <div className="noise-layer" aria-hidden />
        <SignalSpine />
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Marquee />
          <About />
          <SkillsMap />
          <ProjectsLab />
          <HowIThink />
          <BuildWithMe />
          <Journey />
          <PortfolioArchitecture />
          <Contact />
        </main>
        <Footer />
        <ChatWidget />
        <VisitorModal />
        <ModeBadge />
      </LazyMotion>
    </LanguageProvider>
  );
}
