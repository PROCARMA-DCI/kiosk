export const playWheelSound = (link: string, loop: boolean = false) => {
  const audio = new Audio(link);
  audio.volume = 1.0; // 0.0 – 1.0
  audio.loop = loop;

  audio.play().catch((err) => console.log("Sound play error:", err));
  return audio;
};
