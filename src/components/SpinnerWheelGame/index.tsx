"use client";

const demoSegments = [
  {
    id: "1",
    // label: "Prize 1",
    // points: 100,
    color: "#FF6B6B",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "2",
    // label: "Prize 2",
    // points: 200,
    color: "#4ECDC4",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "3",
    // label: "Prize 3",
    // points: 300,
    color: "#FFE66D",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "4",
    // label: "Prize 4",
    // points: 100,
    color: "#95E1D3",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "5",
    // label: "Prize 5",
    // points: 200,
    color: "#F38181",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "6",
    // label: "Prize 6",
    //   points: 300,
    color: "#AA96DA",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "2",
    // label: "Prize 2",
    // points: 200,
    color: "#4ECDC4",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "3",
    // label: "Prize 3",
    // points: 300,
    color: "#FFE66D",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "4",
    // label: "Prize 4",
    // points: 100,
    color: "#95E1D3",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "5",
    // label: "Prize 5",
    // points: 200,
    color: "#F38181",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "6",
    // label: "Prize 6",
    //   points: 300,
    color: "#AA96DA",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "2",
    // label: "Prize 2",
    // points: 200,
    color: "#4ECDC4",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "3",
    // label: "Prize 3",
    // points: 300,
    color: "#FFE66D",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "4",
    // label: "Prize 4",
    // points: 100,
    color: "#95E1D3",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "5",
    // label: "Prize 5",
    // points: 200,
    color: "#F38181",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "6",
    // label: "Prize 6",
    //   points: 300,
    color: "#AA96DA",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "2",
    // label: "Prize 2",
    // points: 200,
    color: "#4ECDC4",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "3",
    // label: "Prize 3",
    // points: 300,
    color: "#FFE66D",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "4",
    // label: "Prize 4",
    // points: 100,
    color: "#95E1D3",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "5",
    // label: "Prize 5",
    // points: 200,
    color: "#F38181",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
  {
    id: "6",
    // label: "Prize 6",
    //   points: 300,
    color: "#AA96DA",
    content: { type: "image", value: "/images/kaos/kaos1.png" },
  },
];

import { playWheelSound } from "@/utils/helpers";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { showConfetti } from "../showConfetti";

export const SpinnerWheelGame = React.forwardRef(
  (
    {
      segments = demoSegments,
      onSpinComplete,
      onSpinStart,
      size = 400,
      spinDuration = 5,
      spinPower = 5,
      borderColor = "#fff",
      borderWidth = 0.02,
      pointerColor = "#FFD700",
      showLabels = true,
      textColor = "#fff",
      className = "",
      renderSegmentContent,
      isSpinning,
      setIsSpinning,
    }: any,
    ref: any
  ) => {
    const containerRef = useRef(null);

    const [rotation, setRotation] = useState(0);

    const validSegments = Array.isArray(segments) ? segments : [];
    const segmentAngle =
      validSegments.length > 0 ? 360 / validSegments.length : 0;
    const radius = size / 2;

    const spin = useCallback(() => {
      playWheelSound("/sound/SpinningPrizeWheelSoundEffect.mp3");
      if (isSpinning || validSegments.length === 0) return;

      setIsSpinning(true);
      onSpinStart?.();

      const randomSpin = Math.random() * 360 * spinPower + 360 * 5;
      const newRotation = (rotation + randomSpin) % 360;

      const startTime = Date.now();
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / spinDuration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentRotation = rotation + randomSpin * easeOut;

        setRotation(currentRotation % 360);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Confetti explosion effect
          showConfetti();
          setRotation(newRotation);
          setIsSpinning(false);

          const normalizedRotation = (360 - (newRotation % 360)) % 360;
          const selectedIndex =
            Math.floor(normalizedRotation / segmentAngle) %
            validSegments.length;
          const selected = validSegments[selectedIndex];

          onSpinComplete?.(selected);
        }
      };

      requestAnimationFrame(animate);
    }, [
      rotation,
      isSpinning,
      spinDuration,
      spinPower,
      validSegments,
      segmentAngle,
      onSpinStart,
      onSpinComplete,
    ]);

    const createSegmentPath = (index: number) => {
      const startAngle = (index * segmentAngle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * segmentAngle - 90) * (Math.PI / 180);

      const x1 = radius + radius * Math.cos(startAngle);
      const y1 = radius + radius * Math.sin(startAngle);
      const x2 = radius + radius * Math.cos(endAngle);
      const y2 = radius + radius * Math.sin(endAngle);

      const largeArc = segmentAngle > 180 ? 1 : 0;

      return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    if (validSegments.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <p>No segments available</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center gap-8 ${className}`}
      >
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: size,
            height: size,
          }}
        >
          {/* arrow button */}
          <div
            className="absolute z-20"
            style={{
              top: "-10px", // adjust as needed
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Image
              src="/images/arrowspinner.png"
              width={100}
              height={100}
              alt="arrow"
              className="w-[58.62px] h-[58.82px]"
            />
          </div>

          <svg
            width={size}
            height={size}
            viewBox={`-${size * 0.05} -${size * 0.05} ${size * 1.1} ${
              size * 1.1
            }`} // extra space for shadow
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? "none" : "transform 0.3s ease-out",
            }}
            className="rounded-full overflow-visible" // make sure shadow isn't clipped
          >
            {validSegments.map((segment, index) => {
              const segmentColor =
                segment.color ||
                `hsl(${(index * 360) / validSegments.length}, 70%, 60%)`;

              return (
                <path
                  key={segment.id}
                  d={createSegmentPath(index)}
                  fill={segmentColor}
                  stroke={borderColor}
                  strokeWidth={size * borderWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  // style={{
                  //   // 👇 shadow OUTSIDE each slice, using same color
                  //   filter: `drop-shadow(0 ${size * 0.05}px ${
                  //     size * 0.2
                  //   }px ${segmentColor}80)`,
                  // }}
                />
              );
            })}
          </svg>

          {/* Center Button */}
          <div
            className="absolute z-10 cursor-pointer flex items-center justify-center"
            onClick={spin}
            style={{
              width: size * 0.15,
              height: size * 0.15,
              top: "50%",
              left: "50%",
              marginLeft: `-${(size * 0.15) / 2}px`,
              marginTop: `-${(size * 0.15) / 2}px`,
            }}
          >
            <div
              className="w-full h-full bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white"
              style={{
                boxShadow: "0 0 30px 10px rgba(255, 204, 0, 0.5)", // yellow glow
              }}
            >
              <span>
                <Image
                  src="/images/star.png"
                  width={40}
                  height={40}
                  alt="start"
                  className="w-[39.44px] h-[39.44px]"
                />
              </span>
            </div>
          </div>

          {/* Content overlay - positioned absolutely */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {validSegments.map((segment, index) => {
              const midAngle =
                (index * segmentAngle + segmentAngle / 2 - 90) *
                (Math.PI / 180);
              const contentRadius = radius * 0.65;
              const x = contentRadius * Math.cos(midAngle);
              const y = contentRadius * Math.sin(midAngle);

              return (
                <div
                  key={`content-${segment.id}`}
                  className="absolute flex flex-col items-center gap-1 "
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${-rotation}deg)`,
                    left: "50%",
                    top: "50%",
                    pointerEvents: "none",
                  }}
                >
                  {renderSegmentContent ? (
                    renderSegmentContent(segment, index)
                  ) : (
                    <>
                      {segment.content && (
                        <>
                          {segment.content.type === "text" && (
                            <div
                              className="font-bold text-center "
                              style={{
                                color: textColor,
                                fontSize: `${Math.max(12, radius * 0.15)}px`,
                                textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                              }}
                            >
                              {segment.content.value}
                            </div>
                          )}
                          {segment.content.type === "image" && (
                            <img
                              src={segment.content.value || "/placeholder.svg"}
                              alt={segment.content.alt || segment.label}
                              className="max-w-max max-h-20  object-cover rounded-full"
                            />
                          )}
                          {segment.content.type === "icon" && (
                            <div
                              style={{
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                                fontSize: `${Math.max(20, radius * 0.2)}px`,
                              }}
                            >
                              {segment.content.value}
                            </div>
                          )}
                          {segment.content.type === "custom" && (
                            <div
                              style={{
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                              }}
                            >
                              {segment.content.value}
                            </div>
                          )}
                        </>
                      )}
                      {/* Points display */}
                      {segment.points && (
                        <div
                          style={{
                            color: textColor,
                            fontSize: `${Math.max(10, radius * 0.12)}px`,
                            fontWeight: "bold",
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {segment.points} pts
                        </div>
                      )}

                      {/* Label display */}
                      {showLabels && segment.label && (
                        <div
                          style={{
                            color: textColor,
                            fontSize: `${Math.max(9, radius * 0.1)}px`,
                            fontWeight: "600",
                            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                          }}
                        >
                          {segment.label}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

SpinnerWheelGame.displayName = "SpinnerWheelGame";
