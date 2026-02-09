const audioStore: Record<string, HTMLAudioElement> = {};

export const playWheelSound = (
  link: string,
  loop: boolean = false,
  key?: string,
) => {
  // If key exists, stop only that sound
  if (key && audioStore[key]) {
    audioStore[key].pause();
    audioStore[key].currentTime = 0;
  }

  const audio = new Audio(link);
  audio.volume = 1.0;
  audio.loop = loop;

  audio.play().catch((err) => console.log("Sound play error:", err));

  // Store only if key is provided
  if (key) {
    audioStore[key] = audio;
  }

  return audio;
};

export const stopWheelSound = (key: string) => {
  const audio = audioStore[key];
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
  delete audioStore[key];
};

export const stopAllWheelSounds = () => {
  for (const key in audioStore) {
    stopWheelSound(key);
  }
};

export const safeAtob = (value: string): string | null => {
  try {
    return atob(value);
  } catch (err) {
    return null; // tampered or invalid
  }
};
