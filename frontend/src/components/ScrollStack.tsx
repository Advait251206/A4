import React, { useLayoutEffect, useRef, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const cardLayoutsRef = useRef<number[]>([]); // Cache original top positions
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

  // Helper to parse "20%" or return number
  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const updateCardTransforms = useCallback((currentScroll: number) => {
    if (isUpdatingRef.current || cardsRef.current.length === 0) return;
    isUpdatingRef.current = true;

    const containerHeight = useWindowScroll ? window.innerHeight : (scrollerRef.current?.clientHeight || 0);
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
  
    // Determine the end boundary
    let endElementTop = 0;
    const endElement = useWindowScroll
       ? (document.querySelector('.scroll-stack-end') as HTMLElement)
       : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement);
    
    // We can't rely on getBoundingClientRect for layout stable calculation easily if things move, 
    // but the end element is after the spacer, so its offsetTop relative to document/container should be stable.
    if (endElement) {
       endElementTop = useWindowScroll 
          ? endElement.getBoundingClientRect().top + window.scrollY // Initial read should be fine or we need to cache this too. 
                                                                    // Actually, since endElement is AFTER the flow, it might be pushed down.
                                                                    // For simplicity, let's trust one read or reflow.
                                                                    // Better: use relative cached offsets.
          : endElement.offsetTop;
    }

    // However, since we are moving cards with translate, flow might be reserved by margins.
    // Let's rely on cached layouts for cards.

    cardsRef.current.forEach((card, i) => {
      // Retrieve cached original top position
      const cardTop = cardLayoutsRef.current[i];
      if (cardTop === undefined) return;

      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      
      // Pinning logic
      // In a real stack, the pin end is usually when the section ends.
      // Here we approximate based on the container center relative to end element?
      // Let's use the logic from before but with cache.
      
      // Ideally pinEnd is where the card should stop being sticky.
      // Simplification: Pin until it scrolls past a point.
      // The original logic used endElementTop. Let's assume endElementTop is effectively stable relative to flow. 
      // If we are strictly animating transform, the strict layout position (offsetTop) of the end element shouldn't change.
      // But getBoundingClientRect().top changes with scroll. 
      // getBoundingClientRect().top + scrollY is the absolute position.
      
      // Let's re-read endElementTop properly in a way that doesn't jitter.
      // If we use useWindowScroll, endElement.offsetTop (recursive) is best.
      let absoluteEndTop = 0;
      if (endElement) {
         // This is expensive to calculate recursively every frame. 
         // But for now, let's use the rect approach but beware.
         // Actually, if we just use the cached Card Top of the LAST card + some buffer?
         absoluteEndTop = cardLayoutsRef.current[cardsRef.current.length-1] + itemDistance * 5; // Rough estimate or just read the DOM.
         
         // Let's try to trust the DOM read for the End Element for now, but purely absolute.
         if (useWindowScroll) {
             const rect = endElement.getBoundingClientRect();
             absoluteEndTop = rect.top + window.scrollY; // This works if endElement isn't moving. 
                                                         // End element is just a div at the bottom.
         } else {
             absoluteEndTop = endElement.offsetTop;
         }
      }

      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = absoluteEndTop - containerHeight / 2;

      const scaleProgress = calculateProgress(currentScroll, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
         // Simplified blur logic
         // ... existing logic ...
      }

      let translateY = 0;
      const isPinned = currentScroll >= pinStart && currentScroll <= pinEnd;

      if (isPinned) {
        translateY = currentScroll - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (currentScroll > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: 0
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1;

      if (hasChanged) {
        // Use translate3d for GPU
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        lastTransformsRef.current.set(i, newTransform);
      }
    });

    isUpdatingRef.current = false;
  }, [baseScale, blurAmount, calculateProgress, itemDistance, itemScale, itemStackDistance, parsePercentage, rotationAmount, scaleEndPosition, stackPosition, useWindowScroll]);


  // Capture initial layout
  const cacheLayout = useCallback(() => {
     if (!cardsRef.current.length) return;
     
     // Reset transforms to get clean layout reading
     cardsRef.current.forEach(c => c.style.transform = '');
     
     cardLayoutsRef.current = cardsRef.current.map(card => {
        if (useWindowScroll) {
           const rect = card.getBoundingClientRect();
           return rect.top + window.scrollY;
        } else {
           return card.offsetTop;
        }
     });

     // Force update after caching
     // We need to read current scroll to re-apply
     const currentScroll = useWindowScroll ? window.scrollY : (scrollerRef.current?.scrollTop || 0);
     updateCardTransforms(currentScroll);

  }, [useWindowScroll, updateCardTransforms]);


  // Setup Lenis
  const setupLenis = useCallback(() => {
     // Identical initialization, but pass scroll event to updateCardTransforms
     const isRoot = useWindowScroll;
     const target = isRoot ? window : scrollerRef.current;
     if (!target && !isRoot) return;

     const lenis = new Lenis({
        wrapper: isRoot ? window : (target as HTMLElement),
        content: isRoot ? document.documentElement : (target as HTMLElement)?.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2
     });

     lenis.on('scroll', (e: any) => {
        // e.scroll is the lenis smoothed scroll position
        updateCardTransforms(e.scroll);
     });

     const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
     };
     animationFrameRef.current = requestAnimationFrame(raf);
     
     lenisRef.current = lenis;

  }, [useWindowScroll, updateCardTransforms]);


  useLayoutEffect(() => {
    // 1. Find cards
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;
    
    // Select cards
    const selectorScope = useWindowScroll ? document : scroller!;
    const cards = Array.from(selectorScope.querySelectorAll('.scroll-stack-card')) as HTMLElement[];
    cardsRef.current = cards;

    // 2. Init Styles
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
    });

    // 3. Cache Layout
    cacheLayout();

    // 4. Setup Lenis (starts loop)
    setupLenis();
    
    // Handle resize
    const onResize = () => {
       cacheLayout();
    };
    window.addEventListener('resize', onResize);

    return () => {
       window.removeEventListener('resize', onResize);
       if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
       lenisRef.current?.destroy();
       cardsRef.current = [];
       lastTransformsRef.current.clear();
    };

  }, [itemDistance, useWindowScroll, cacheLayout, setupLenis, blurAmount]); // Dependencies

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
