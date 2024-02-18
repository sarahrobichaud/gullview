import Lightbox from "./Lightbox.ts";

try {
  const lightbox = Lightbox.build({
    targetClass: "lightbox__src",
    zoom: {
      enabled: true,
      level: 3,
      blockNative: true,
    },
    animation: {
      display: {
        enabled: true,
        duration: 600,
      },
    },
    counter: {
      enabled: true,
    },
    dock: {
      enabled: false,
      motion: true,
      zoom: true,
    },
  });
  lightbox.init();
} catch (e) {
  console.log(e);
  console.error(`Error: ${e.message}`);
}
