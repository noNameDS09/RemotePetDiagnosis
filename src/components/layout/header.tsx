"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, PawPrint, User } from "lucide-react";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

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
              setIsLoading(true);
                router.push("/doctor");
                setIsLoading(false);
            }}
          >
            <User className="h-8 w-8 " />
          </Button>
          <Button
            onClick={() => {
              setIsLoading(true);
                router.push("/logout");
                setIsLoading(false)
            }}
          >
            <LogOut className="h-8 w-8 " />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
