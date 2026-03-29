"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  ZoomIn,
} from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  vehicleName: string;
  status?: string;
  isFeatured?: boolean;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

const springTransition = {
  x: { type: "spring" as const, stiffness: 280, damping: 28 },
  opacity: { duration: 0.15 },
};

export default function ImageGallery({
  images,
  vehicleName,
  status = "available",
  isFeatured = false,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [thumbnailPage, setThumbnailPage] = useState(0);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const lastTapRef = useRef<number>(0);

  // Calculate visible thumbnails per page based on screen size
  const getVisibleThumbnails = useCallback(() => {
    if (typeof window === 'undefined') return 5;
    const width = window.innerWidth;
    if (width < 640) return 5; // mobile
    if (width < 768) return 6; // sm
    if (width < 1024) return 7; // md
    return 8; // lg+
  }, []);

  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(getVisibleThumbnails());
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [getVisibleThumbnails]);

  // Calculate total pages
  const totalPages = Math.ceil(images.length / visibleCount);
  
  // Get visible thumbnails for current page
  const getVisibleThumbnailRange = useCallback(() => {
    const start = thumbnailPage * visibleCount;
    const end = Math.min(start + visibleCount, images.length);
    return { start, end };
  }, [thumbnailPage, visibleCount, images.length]);

  // Navigate to previous thumbnail page
  const goToPrevThumbnailPage = useCallback(() => {
    setThumbnailPage((prev) => Math.max(0, prev - 1));
  }, []);

  // Navigate to next thumbnail page
  const goToNextThumbnailPage = useCallback(() => {
    setThumbnailPage((prev) => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  // Update thumbnail page when navigating to keep active thumbnail visible
  const updateThumbnailPageForIndex = useCallback((index: number) => {
    const activePage = Math.floor(index / visibleCount);
    setThumbnailPage(activePage);
  }, [visibleCount]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
      updateThumbnailPageForIndex(index);
    },
    [currentIndex, updateThumbnailPageForIndex]
  );

  // Keyboard navigation (fullscreen only)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  // Auto-scroll thumbnail strip to keep active thumb visible
  useEffect(() => {
    const strip = thumbnailScrollRef.current;
    if (!strip) return;
    const thumb = strip.children[currentIndex] as HTMLElement | undefined;
    if (thumb) {
      thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex]);

  // Drag handler (desktop + touch)
  const handleDragEnd = useCallback(
    (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const threshold = 60;
      if (info.offset.x > threshold) goToPrevious();
      else if (info.offset.x < -threshold) goToNext();
    },
    [goToPrevious, goToNext]
  );

  // Double-tap to open fullscreen (mobile)
  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setIsFullscreen(true);
    }
    lastTapRef.current = now;
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-4/3 sm:aspect-video md:aspect-16/10 rounded-2xl sm:rounded-3xl bg-(--color-card) flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ─── Main Viewport ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative max-h-[280px] sm:max-h-[350px] md:max-h-[520px] aspect-video md:aspect-16/10 w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-950 select-none group"
        onClick={handleTap}
      >
        {/* Slide Stack — inner overflow-hidden prevents horizontal bleed during transitions */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <Image
                src={images[currentIndex]}
                alt={`${vehicleName} — photo ${currentIndex + 1}`}
                fill
                className="object-contain pointer-events-none"
                priority={currentIndex === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status badge */}
        {status !== "available" && (
          <div className="absolute top-5 left-5 z-20">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
              status === "sold" ? "bg-red-500 text-white"
              : status === "reserved" ? "bg-orange-500 text-white"
              : "bg-blue-500 text-white"
            }`}>
              {status === "sold" ? "Sold" : status === "reserved" ? "Reserved" : "In Transit"}
            </span>
          </div>
        )}

        {/* Featured badge */}
        {isFeatured && status === "available" && (
          <div className="absolute top-5 left-5 z-20">
            <span className="px-4 py-1.5 rounded-full bg-amber-500 text-black text-sm font-semibold flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Premium
            </span>
          </div>
        )}

        {/* Prev/Next arrows — always visible on mobile, hover on desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 backdrop-blur text-white border border-white/10 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-black hover:border-transparent"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 backdrop-blur text-white border border-white/10 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-amber-500 hover:text-black hover:border-transparent"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Top-right: fullscreen button + swipe hint on mobile */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Mobile swipe hint */}
          {images.length > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs border border-white/10"
            >
              <ZoomIn className="w-3 h-3" />
              <span>double-tap</span>
            </motion.div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
            className="p-2.5 rounded-full bg-black/50 backdrop-blur text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Counter */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-white text-xs font-medium border border-white/10 tabular-nums">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Dot indicators (compact, bottom-center) */}
        {images.length > 1 && images.length <= 12 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); goToSlide(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-5 h-1.5 bg-amber-500"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* ─── Paginated Thumbnail Strip ─── */}
      {images.length > 1 && (
        <div className="flex items-center gap-2">
          {/* Previous page button */}
          {totalPages > 1 && (
            <button
              onClick={goToPrevThumbnailPage}
              disabled={thumbnailPage === 0}
              className="shrink-0 p-1.5 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous thumbnails"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Thumbnail container */}
          <div
            ref={thumbnailScrollRef}
            className="flex gap-2 flex-1 justify-center overflow-hidden"
          >
            {images.slice(getVisibleThumbnailRange().start, getVisibleThumbnailRange().end).map((image, idx) => {
              const actualIndex = getVisibleThumbnailRange().start + idx;
              return (
                <button
                  key={actualIndex}
                  onClick={() => goToSlide(actualIndex)}
                  style={{ minWidth: actualIndex === currentIndex ? "3rem" : "2.5rem" }}
                  className={`relative shrink-0 h-10 sm:h-12 md:h-14 rounded-lg overflow-hidden transition-all duration-300 ${
                    actualIndex === currentIndex
                      ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-black scale-105 opacity-100"
                      : "opacity-50 hover:opacity-90 hover:scale-105"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${vehicleName} thumbnail ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              );
            })}
          </div>

          {/* Next page button */}
          {totalPages > 1 && (
            <button
              onClick={goToNextThumbnailPage}
              disabled={thumbnailPage >= totalPages - 1}
              className="shrink-0 p-1.5 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white transition-all border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next thumbnails"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}


      {/* ─── Fullscreen Lightbox ─── */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-100 bg-black flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header bar */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white/60 text-sm font-medium truncate max-w-[70%]">{vehicleName}</p>
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm tabular-nums">
                  {currentIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Close fullscreen"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main image */}
            <div
              className="relative flex-1 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={springTransition}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.1}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={images[currentIndex]}
                    alt={`${vehicleName} — fullscreen ${currentIndex + 1}`}
                    fill
                    className="object-contain pointer-events-none"
                    priority
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Fullscreen nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white transition-all border border-white/10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-7 h-7" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-amber-500 hover:text-black text-white transition-all border border-white/10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-7 h-7" />
                  </button>
                </>
              )}
            </div>

            {/* Fullscreen thumbnail strip */}
            {images.length > 1 && (
              <div
                className="flex gap-2 px-4 pt-3 pb-4 overflow-x-auto scrollbar-hide shrink-0"
                onClick={(e) => e.stopPropagation()}
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    style={{ minWidth: idx === currentIndex ? "4.5rem" : "3.5rem" }}
                    className={`relative shrink-0 h-12 rounded-lg overflow-hidden transition-all duration-300 ${
                      idx === currentIndex
                        ? "ring-2 ring-amber-500 scale-110 opacity-100"
                        : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}