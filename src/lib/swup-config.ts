import Swup from "swup";

export const initializeSwup = () => {
  const swup = new Swup({
    containers: ["#app"], // Container where content will be replaced
    skipPopStateHandling: false,
    cache: true,
    preload: true,
    parallel: true,
    animationSelector: "[class*='animate-']",
  });

  return swup;
};
