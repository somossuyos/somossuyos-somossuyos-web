import { MediaData } from '../entities/types/SharedTypes';
import { BookDTO } from '../infrastructure/DTOs/Books';
import { addItem } from '../redux/features/cartSlice';
import { useAppDispatch } from '../redux/hooks';

export default function useBuyCourseButton(book: MediaData<BookDTO> |null) {
  const dispatch = useAppDispatch();

  const buyCourse = () => {
    dispatch(
      addItem({
        id: 1,
        thumbnail:
          'https://somossuyos-cms-data.s3.us-east-1.amazonaws.com/post_Retiro_c_rotos_500_x_470_px_0f9ae36143.png',
        title: 'Sanación de un corazón roto',
        type: 'courses',
        price: 140000,
        quantity: 1,
        category: 'Curso',
      })
    );
  };

  const buyBook = () => {
    if (book && book !== null) {
      dispatch(
        addItem({
          id: book.data.id,
          thumbnail: book.data.attributes?.thumbnail?.data.attributes.url || '',
          title: book.data.id,
          type: 'book',
          price: book.data.attributes?.price ?? 0,
          quantity: 1,
          category: 'Libro',
          url: book.data.attributes?.link,
        })
      );
    }
  };

  return { buyCourse, buyBook };
}
