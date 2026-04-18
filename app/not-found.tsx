"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-between px-6 overflow-hidden">
      {/* Animated background matching fanlink design */}
      <div className="fixed inset-0 w-full h-full">
        {/* Base gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(166, 41, 40, 0.3) 0%, rgba(31, 31, 31, 0.9) 40%, #0a0a0a 70%)",
          }}
        />

        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a62928] rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#d63c3a] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center max-w-2xl mx-auto space-y-6 py-12">
        {/* Storyset Illustration */}
        <div className="flex justify-center mb-8">
          <Image
            src="/404illustration.svg"
            alt="Page not found illustration"
            width={320}
            height={320}
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Error Message */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Release Not Found
        </h2>
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          The release you&apos;re looking for doesn&apos;t exist or may have
          been removed.
        </p>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-[#1f1f1f]/50 backdrop-blur-sm rounded-2xl border border-[#a62928]/20 hover:border-[#a62928]/40 transition-all duration-300">
          <p className="text-gray-400 text-sm">
            Please check the link you received or contact support if you believe
            this is an error.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 pb-6 sm:pb-8">
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
          <p className="font-work-sans text-white/70 text-sm sm:text-base tracking-wide whitespace-nowrap">
            Powered by Yivera Disto
          </p>
        </Link>
      </footer>
    </div>
  );
}
