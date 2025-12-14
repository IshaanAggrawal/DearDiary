import { useEffect, useRef, useState } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export default function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [element, setElement] = useState<Element | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!element) return;

    observer.current = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.current.observe(element);

    return () => {
      if (observer.current) {
        observer.current.unobserve(element);
        observer.current.disconnect();
      }
    };
  }, [element, options.root, options.rootMargin, options.threshold]);

  return { isIntersecting, setElement };
}