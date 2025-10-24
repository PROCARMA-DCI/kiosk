import confetti from "canvas-confetti";

export function showConfetti(config: any | undefined = undefined) {
  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "2147483647",
  });
  document.body.appendChild(canvas);

  const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
  myConfetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 },
    ...config,
  });

  setTimeout(() => canvas.remove(), 4000);
}
