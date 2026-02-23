import { useEffect, useState } from "react";

export const HERO_MESSAGES = [
  "Dispatch-ready in seconds. Your route syncs as you sign in.",
  "Your rides, payments, and pickup ETA line up automatically.",
  "Live routes flow to drivers the moment you're back online.",
];

export const useRotatingMessage = (
  messages: string[] = HERO_MESSAGES,
  intervalMs: number = 3600,
) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [messages, intervalMs]);

  return {
    index,
    message: messages[index] ?? "",
  };
};
