"use client";
import { useState, useEffect } from 'react';

const useScrollPosition = (scrollThreshold = 80): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(currentScrollY > scrollThreshold);
    };
    window.addEventListener('scroll', updatePosition);
    return () => window.removeEventListener('scroll', updatePosition);
  }, [scrollThreshold]);

  return isScrolled;
};

export default useScrollPosition;