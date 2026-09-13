import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SecureChainFrameAnimationProps {
  totalFrames?: number;
  fps?: number;
  className?: string;
  overlayOpacity?: number;
  objectFit?: 'cover' | 'contain';
}

export const SecureChainFrameAnimation: React.FC<SecureChainFrameAnimationProps> = ({
  totalFrames = 300,
  fps = 24,
  className = '',
  overlayOpacity = 0.12,
  objectFit = 'contain',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);

  // Cache loaded Image objects in memory
  const imagesRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentIndexRef = useRef<number>(1);
  const isVisibleRef = useRef<boolean>(true);
  const isTabActiveRef = useRef<boolean>(true);
  const animFrameIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  const framePath = useCallback((index: number) => {
    return `/animations/securechain/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
  }, []);

  // Draw a specific frame to canvas
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  // Load an individual frame
  const loadFrame = useCallback((index: number): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const existing = imagesRef.current.get(index);
      if (existing && existing.complete && existing.naturalWidth > 0) {
        resolve(existing);
        return;
      }

      const img = new Image();
      img.src = framePath(index);
      img.onload = () => {
        imagesRef.current.set(index, img);
        resolve(img);
      };
      img.onerror = () => {
        // Fallback gracefully on missing frame
        const fallback = imagesRef.current.get(1) || imagesRef.current.get(index - 1);
        if (fallback) {
          resolve(fallback);
        } else {
          reject(new Error(`Failed to load frame ${index}`));
        }
      };
    });
  }, [framePath]);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const listener = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  // Initial load: Poster frame (frame 1)
  useEffect(() => {
    loadFrame(1).then((img) => {
      drawFrame(img);
      setFirstFrameLoaded(true);
    }).catch(() => {
      setFirstFrameLoaded(true);
    });
  }, [loadFrame, drawFrame]);

  // Background progressive preloading without blocking the page
  useEffect(() => {
    let isCancelled = false;
    const batchSize = 10;
    let currentBatchStart = 2;

    const preloadNextBatch = () => {
      if (isCancelled || currentBatchStart > totalFrames) return;

      const batchPromises = [];
      const end = Math.min(currentBatchStart + batchSize, totalFrames + 1);
      for (let i = currentBatchStart; i < end; i++) {
        batchPromises.push(loadFrame(i).catch(() => null));
      }

      currentBatchStart = end;

      Promise.all(batchPromises).then(() => {
        if (!isCancelled && currentBatchStart <= totalFrames) {
          // schedule next batch with requestIdleCallback or setTimeout
          if ('requestIdleCallback' in window) {
            (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(preloadNextBatch);
          } else {
            setTimeout(preloadNextBatch, 80);
          }
        }
      });
    };

    // Begin background preloading
    const timer = setTimeout(preloadNextBatch, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [totalFrames, loadFrame]);

  // Page visibility & Intersection observer
  useEffect(() => {
    const handleVisibilityChange = () => {
      isTabActiveRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const container = containerRef.current;
    let observer: IntersectionObserver | null = null;
    if (container && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (observer && container) observer.unobserve(container);
    };
  }, []);

  // Animation playback loop
  useEffect(() => {
    if (isReducedMotion) {
      // In reduced-motion mode, show static poster frame
      loadFrame(1).then(drawFrame);
      return;
    }

    const frameInterval = 1000 / fps;

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;

      if (elapsed >= frameInterval) {
        lastFrameTimeRef.current = timestamp - (elapsed % frameInterval);

        if (isVisibleRef.current && isTabActiveRef.current) {
          const nextIndex = (currentIndexRef.current % totalFrames) + 1;
          const cachedImg = imagesRef.current.get(nextIndex);

          if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
            currentIndexRef.current = nextIndex;
            drawFrame(cachedImg);
          } else {
            // If next frame is still loading, try to pre-fetch it and hold current
            loadFrame(nextIndex).then(() => {
              currentIndexRef.current = nextIndex;
            }).catch(() => {});
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [fps, totalFrames, isReducedMotion, loadFrame, drawFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}
    >
      {/* First Frame Static Poster Fallback (renders until canvas draws or if reduced motion) */}
      {!firstFrameLoaded && (
        <img
          src={framePath(1)}
          alt="SecureChain AI Animation Poster"
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} opacity-90`}
          loading="eager"
        />
      )}

      {/* Render Canvas for Smooth 24FPS Frame Sequence */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'} transition-opacity duration-300 ${
          firstFrameLoaded ? 'opacity-95' : 'opacity-0'
        }`}
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Existing theme contrast overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, rgba(250, 249, 246, 0) 45%, rgba(250, 249, 246, ${overlayOpacity + 0.4}) 100%)`,
        }}
      />
      
      {/* Subtle bottom fade to seamlessly blend into page background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
