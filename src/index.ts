import Lightbox from "./Lightbox.ts";

try {
  const lightbox = new Lightbox({
    targetClass: "lightbox__src",
    zoom: {
      enabled: true,
      level: 3,
      blockNative: true,
    },
    animation: {
      enabled: true,
      duration: 500,
    },
    counter: {
      show: true,
    },
  });
  lightbox.init();
} catch (e) {
  console.error(`Error: ${e.message}`);
}
