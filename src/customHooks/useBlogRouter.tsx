import { useRouter } from 'next/router';
import useWindowWidth from '@/src/customHooks/useWindowSize';
import { useState } from 'react';

export default function useBlogRouter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const router = useRouter();
  const { category = '' } = router.query;

  const { windowWidth } = useWindowWidth();

  const handleClick = () => {
    if (selectedCategory === '') {
      return router.push('/blog');
    }
    return router.push(`/blog?category=${selectedCategory}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (windowWidth < 640) {
      return router.push(`/blog?category=${value}`);
    }
    setSelectedCategory(value);
  };

  return {
    selectedCategory,
    handleClick,
    handleChange,
    category: category as string
  };

}