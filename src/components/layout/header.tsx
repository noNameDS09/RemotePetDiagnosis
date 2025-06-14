"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FastForward, Loader2, LogOut, PawPrint, User } from "lucide-react";
import Button from "@mui/material/Button";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);
  const router = useRouter();

  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setIsVisible(window.scrollY < lastScrollY);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    // Fetch role info on mount
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          const data = await res.json();
          setIsDoctor(data.isDoctor);
        } else {
          setIsDoctor(null);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserRole();
  }, []);

  const handleProfileClick = () => {
    setIsLoading(true);
    if (isDoctor === true) {
      router.push("/dashboard/doctor");
    } else if (isDoctor === false) {
      router.push("/dashboard/user");
    } else {
      // fallback if role unknown
      router.push("/");
    }
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <motion.header
      className="bg-card border-b border-border sticky top-0 z-50 shadow-sm"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -80 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/")}>
            <PawPrint className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-semibold text-foreground">
              PetConnect
            </h1>
          </Button>
        </div>
        <div className="flex justify-center items-center flex-wrap">
          <Button
            onClick={() => {
              handleProfileClick();
            }}
          >
            <User className="h-8 w-8" />
          </Button>
          <Button
            onClick={() => {
              setIsLoading(true);
              router.push("/auth/logout");
              setIsLoading(false);
            }}
          >
            <LogOut className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
