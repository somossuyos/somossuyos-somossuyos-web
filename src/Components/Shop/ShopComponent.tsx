import Marquee from 'react-fast-marquee';
import ShopItem from './ShopItem';
import { ShopPageProps } from '@/pages/tienda';

type ShopComponentProps = ShopPageProps;

const ShopComponent = ({ shopItems }: ShopComponentProps) => {
  return (
    <div className='bg-white text-black pt-[150px] sm:pt-[200px]'>
      <h2 className='ml-[50px] xl:ml-[200px] 2xl:ml-[250px] font-stretch-pro text-[30px] sm:text-[60px] leading-[27px] sm:leading-[55px] relative z-10'>Nuestra <br />
        <span className='font-dark-twenty text-[50px] sm:text-[90px]'>tienda</span>
      </h2>
      <Marquee className='-mt-[230px] 2xl:-mt-[200px] sm:-mt-[320px] relative z-0'>
        <p className='font-stretch-pro text-border-black text-[250px] sm:text-[400px] text-white'>Tienda</p>
      </Marquee>
      <div
        className='px-4 sm:px-[70px] flex flex-wrap gap-[50px] my-10 items-center justify-center'
      >
        {
          shopItems.length === 0 && (
            <div className='text-center'>
              <p className='text-xl sm:text-2xl font-bold text-black'>
                No tenemos productos disponibles, debes estar atento a próximas actualizaciones.
              </p>
            </div>
          )
        }
        {
          shopItems.map((item) => (
            <ShopItem
              key={`shop-item-${item.category}-${item.id}`}
              image={item.thumbnail}
              title={item.title}
              isNew={item.isNew}
              imageHeight={item.thumbnailHeight}
              slug={item.slug}
              category={item.category}
              price={item.price}
              link={`/tienda/${item.category.slug}/${item.slug}`}
            />
          ))
        }
      </div>
      <br></br>
    </div>
  );
};

export default ShopComponent;