"use client";

import landingImage from "../../public/landing_image.png";
import {  SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function LandingPage() {
  const user = useUser();

  const isSignedIn = user.isSignedIn;
  
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${landingImage.src})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Store Your Files in the Cloud
        </h1>
        <p className="mt-6 max-w-md mx-auto text-xl sm:text-2xl text-gray-300">
          Secure, fast, and accessible from anywhere. Your files, your way.
        </p>
        <div className="mt-10">
          {isSignedIn ? (
            <Link href="/dashboard/files">
              <Button className="text-white text-lg px-8 py-3 rounded-full  bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 shadow-lg" >Go to Dashboard</Button>
            </Link>
          ) : (
            <SignInButton mode="modal">
              <Button className="text-white text-lg px-8 py-3 rounded-full  bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 shadow-lg">
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
