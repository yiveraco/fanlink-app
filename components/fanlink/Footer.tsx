"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterProps } from "@/types";

export const Footer: React.FC<FooterProps> = ({ artistName, socialLinks }) => {
  return (
    <footer className="flex flex-col items-center gap-8 sm:gap-10 md:gap-12 w-full max-w-[280px] pb-6 sm:pb-8 animate-fade-in">
      {/* Social Links */}
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
        <h2 className="font-work-sans font-medium text-white text-lg sm:text-xl text-center tracking-wide leading-relaxed">
          Follow {artistName}
        </h2>

        <div className="flex items-center justify-center gap-4 sm:gap-5">
          {socialLinks.map((social, index) => (
            <a
              key={`${social.name}-${index}`}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:border-white/40 hover:scale-110 hover:-translate-y-1 transition-all duration-300"
              aria-label={`Follow on ${social.name}`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6">{social.svg}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Yivera Branding — links to yivera.com */}
      <Link
        href="https://www.yivera.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 sm:gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
      >
        <Image
          src="/logo.png"
          alt="Yivera Disto"
          width={35}
          height={32}
          className="object-contain"
        />
        <span className="font-work-sans text-white/70 text-sm sm:text-base tracking-wide whitespace-nowrap">
          Powered by Yivera Disto
        </span>
      </Link>
    </footer>
  );
};
