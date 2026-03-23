import { useEffect } from "react";
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";
import SwupPreloadPlugin from "@swup/preload-plugin";

export const useSwup = () => {
  useEffect(() => {
    const swup = new Swup({
      containers: ["#app"],
      cache: true,
      plugins: [new SwupHeadPlugin(), new SwupPreloadPlugin()],
    });

    // Handle page transitions
    (swup as any).on("beforeEnter", () => {
      document.documentElement.style.opacity = "0";
    });

    (swup as any).on("enter", () => {
      document.documentElement.style.transition = "opacity 0.3s ease-in-out";
      document.documentElement.style.opacity = "1";
    });

    return () => {
      swup.destroy();
    };
  }, []);
};
