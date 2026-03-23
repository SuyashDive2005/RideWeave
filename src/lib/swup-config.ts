import Swup from "swup";

export const initializeSwup = () => {
  const swup = new Swup({
    containers: ["#app"], // Container where content will be replaced
    cache: true,
    animationSelector: "[class*='animate-']",
  });

  return swup;
};
