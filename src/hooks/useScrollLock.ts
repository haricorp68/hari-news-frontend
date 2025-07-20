import { useEffect, useRef } from 'react';

export function useScrollLock() {
  const scrollY = useRef(0);

  const lockScroll = () => {
    scrollY.current = window.scrollY;
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY.current}px`;
  };

  const unlockScroll = () => {
    document.body.classList.remove('modal-open');
    document.body.classList.add('scroll-restored');
    window.scrollTo(0, scrollY.current);
    
    // Remove the restoration class after a short delay
    setTimeout(() => {
      document.body.classList.remove('scroll-restored');
    }, 100);
  };

  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, []);

  return { lockScroll, unlockScroll };
} 