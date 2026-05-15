import { useState } from 'react';
export const useShopItem = () => {
  const [isHovered, setIsHovered] = useState(false);
  return {
    isHovered,
    setIsHovered,
  };
};