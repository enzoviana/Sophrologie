import type Lenis from "lenis";

let lenis: Lenis | null = null;

export const registerLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const lockScroll = () => {
  lenis?.stop();
  document.body.style.overflow = "hidden";
};

export const unlockScroll = () => {
  lenis?.start();
  document.body.style.overflow = "";
};
