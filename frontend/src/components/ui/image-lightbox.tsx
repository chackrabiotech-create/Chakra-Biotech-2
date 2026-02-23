"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Share2,
  Heart,
  RotateCw
} from "lucide-react";

interface ImageLightboxProps {
  images: Array<{
    id: number;
    title: string;
    image: string;
    description: string;
  }>;
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ImageLightbox({ 
  images, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrevious();
          break;
        case "ArrowRight":
          onNext();
          break;
        case "+":
        case "=":
          setZoom(prev => Math.min(prev + 0.25, 3));
          break;
        case "-":
          setZoom(prev => Math.max(prev - 0.25, 0.5));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetTransform();
  }, [currentIndex]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            <span className="text-white/60 text-sm">
              {currentImage.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.max(prev - 0.25, 0.5));
              }}
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setZoom(prev => Math.min(prev + 0.25, 3));
              }}
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setRotation(prev => prev + 90);
              }}
            >
              <RotateCw className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                resetTransform();
              }}
            >
              Reset
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onPrevious();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>
          </>
        )}

        {/* Image */}
        <motion.div
          className="relative max-w-[90vw] max-h-[90vh] cursor-move"
          onClick={(e) => e.stopPropagation()}
          drag={zoom > 1}
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          style={{
            x: position.x,
            y: position.y,
          }}
        >
          <motion.img
            key={currentImage.id}
            src={currentImage.image}
            alt={currentImage.title}
            className="max-w-full max-h-full object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: zoom, 
              opacity: 1,
              rotate: rotation
            }}
            transition={{ duration: 0.3 }}
            style={{
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default"
            }}
          />
        </motion.div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white/80 text-sm max-w-2xl mx-auto">
            {currentImage.description}
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Heart className="w-4 h-4 mr-2" />
              Like
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentIndex ? 'border-white' : 'border-white/30'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  // This would need to be passed as a prop
                }}
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}