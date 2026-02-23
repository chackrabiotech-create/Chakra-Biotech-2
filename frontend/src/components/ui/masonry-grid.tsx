"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface MasonryGridProps {
  children: ReactNode[];
  columns?: number;
  gap?: number;
  className?: string;
}

export function MasonryGrid({
  children,
  columns = 3,
  gap = 16,
  className = "",
}: MasonryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const [itemPositions, setItemPositions] = useState<
    Array<{ x: number; y: number }>
  >([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const columnWidth = (containerWidth - gap * (columns - 1)) / columns;

    // Initialize column heights
    const heights = new Array(columns).fill(0);
    const positions: Array<{ x: number; y: number }> = [];

    // Calculate positions for each item
    children.forEach((_, index) => {
      // Find the shortest column
      const shortestColumnIndex = heights.indexOf(Math.min(...heights));

      // Calculate position
      const x = shortestColumnIndex * (columnWidth + gap);
      const y = heights[shortestColumnIndex];

      positions.push({ x, y });

      // Update column height (we'll estimate item height)
      // In a real implementation, you'd measure the actual rendered height
      const estimatedHeight = 200 + Math.random() * 200; // Random height for demo
      heights[shortestColumnIndex] += estimatedHeight + gap;
    });

    setColumnHeights(heights);
    setItemPositions(positions);
  }, [children, columns, gap]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: Math.max(...columnHeights) }}
    >
      {children.map((child, index) => {
        const position = itemPositions[index];
        if (!position) return null;

        return (
          <motion.div
            key={index}
            className="absolute"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              x: position.x,
              y: position.y,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              layout: { duration: 0.3 },
            }}
            style={{
              width: `calc((100% - ${gap * (columns - 1)}px) / ${columns})`,
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
