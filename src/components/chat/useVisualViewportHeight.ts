import { useEffect } from 'react';

export const useVisualViewportHeight = (
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean,
): void => {
  useEffect(() => {
    const el = ref.current;
    const viewport = window.visualViewport;
    if (!isActive || !el || !viewport) return;

    const update = () => el.style.setProperty('--chat-vh', `${viewport.height}px`);
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      el.style.removeProperty('--chat-vh');
    };
  }, [ref, isActive]);
};
