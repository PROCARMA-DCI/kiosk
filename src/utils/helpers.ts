export const playWheelSound = (link: string) => {
  const audio = new Audio(link);
  audio.volume = 1.0; // optional: set between 0.0–1.0
  audio.play().catch((err) => console.log("Sound play error:", err));
};
