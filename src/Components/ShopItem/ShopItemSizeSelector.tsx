import { ShopItemSize } from '@/src/entities/ShopItem';
import React, { Dispatch, SetStateAction } from 'react';

type ShopItemSizeSelectorProps = ShopItemSize & {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
};

const ShopItemSizeSelector = ({ size, available, selected, setSelected }: ShopItemSizeSelectorProps) => {
  return (
    <div
      onClick={() => setSelected(size)}
      className='w-8 h-8 rounded-full mx-1 text-[12px] font-light flex items-center justify-center border border-[#D7D7D7]'
      style={{
        opacity: available ? 1 : 0.5,
        cursor: available ? 'pointer' : 'not-allowed',
        backgroundColor: selected === size ? 'black' : 'white',
        color: selected === size ? 'white' : 'black'
      }}
    >
      {size}
    </div>
  );
};

export default ShopItemSizeSelector;