import useWindowSize from '@/src/customHooks/useWindowSize';
import { Pagination } from '@/src/infrastructure/DTOs/Events/EventsDTO';
import { useRouter } from 'next/router';
import React from 'react';

type BlogPaginatorProps = {
  pagination: Pagination;
};

const BlogPaginator = ({ pagination }: BlogPaginatorProps) => {
  const { pageCount, page } = pagination;
  const { windowWidth: width } = useWindowSize();

  const router = useRouter();

  const goToPage = (page: number) => {
    const { category } = router.query;
    if (category) {
      return router.push(`/blog?page=${page}&category=${category}`);
    }
    return router.push(`/blog?page=${page}`);
  };

  const getPaginationGroup = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(pageCount, page + 2);

    if (page <= 3) {
      end = Math.min(5, pageCount);
    }

    if (page >= pageCount - 2) {
      start = Math.max(1, pageCount - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  };

  const pages = getPaginationGroup();

  return (
    <div className='flex w-full items-center justify-center gap-1 sm:gap-2 mt-8'>
      <button className='text-pale-skin text-[14px] sm:text-[18px] mx-2 sm:mx-6 disabled:opacity-50' disabled={page === 1} onClick={() => goToPage(page - 1)}>{width < 640 ? '<' : 'Anterior'}</button>
      {
        pages.map((_page) => (
          <button
            key={`paginator-item-${_page}`}
            className={`w-10 h-10 rounded-[10px] ${page === _page ? 'border border-pale-skin' : ''}`}
            onClick={() => goToPage(_page)}
          >
            {_page}
          </button>
        ))
      }
      <button
        className='text-pale-skin text-[14px] sm:text-[18px] mx-2 sm:mx-6 disabled:opacity-50'
        disabled={page === pageCount}
        onClick={() => goToPage(page + 1)}
      >{width < 640 ? '>' : 'Siguiente'}</button>
    </div>
  );
};

export default BlogPaginator;