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
        duration: 300,
      },
    },
    counter: {
      show: true,
    },
  });
  lightbox.init();
} catch (e) {
  console.log(e);
  console.error(`Error: ${e.message}`);
}
