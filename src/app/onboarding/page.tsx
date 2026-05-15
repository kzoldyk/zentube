"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Coffee,
  Palette,
  Camera,
  Code,
  Cpu,
  Home,
  Utensils,
  Atom,
  Layers,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveUserInterests } from "@/lib/actions/user";
import { cn } from "@/lib/utils";

const TOPICS = [
  { id: "deep-work", label: "Deep Work", icon: Monitor },
  { id: "coffee", label: "Coffee", icon: Coffee },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "code", label: "Code", icon: Code },
  { id: "technical", label: "Technical", icon: Cpu },
  { id: "lifestyle", label: "Lifestyle", icon: Home },
  { id: "cooking", label: "Cooking", icon: Utensils },
  { id: "science", label: "Science", icon: Atom },
  { id: "minimalism", label: "Minimalism", icon: Layers },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
};

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const toggleTopic = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleStart = async () => {
    if (selected.length < 3) return;
    setIsSaving(true);
    try {
      await saveUserInterests(selected);
      router.push("/feed");
    } catch (error) {
      console.error("Failed to save interests:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12 selection:bg-primary/10">
      <div className="max-w-4xl w-full flex flex-col items-center gap-16">
        <div className="text-center space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70"
          >
            Welcome to Zentube
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
            className="text-muted-foreground text-lg sm:text-2xl font-light"
          >
            What helps you focus? Select at least 3 topics.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full"
        >
          {TOPICS.map((topic) => {
            const isSelected = selected.includes(topic.id);
            const Icon = topic.icon;
            return (
              <motion.button
                key={topic.id}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleTopic(topic.id)}
                className={cn(
                  "group relative flex flex-col items-center justify-center gap-5 p-8 aspect-square rounded-[2rem] border-hairline transition-all duration-500",
                  isSelected
                    ? "bg-primary/[0.03] border-primary/50 ring-1 ring-primary/20 shadow-[0_0_30px_rgba(var(--primary),0.05)]"
                    : "bg-card hover:bg-accent/40"
                )}
              >
                <div
                  className={cn(
                    "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                  )}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <span
                  className={cn(
                    "font-medium text-sm sm:text-base tracking-tight transition-colors duration-500",
                    isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {topic.label}
                </span>
                
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, rotate: -45 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0, rotate: 45 }}
                      className="absolute top-4 right-4 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md"
                    >
                      <Check size={14} strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-12 left-0 right-0 flex justify-center px-6 pointer-events-none"
        >
          <AnimatePresence>
            {selected.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="pointer-events-auto"
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  disabled={isSaving}
                  className="rounded-full px-10 py-7 text-lg font-medium shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Customizing...
                    </div>
                  ) : (
                    "Start Watching"
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
