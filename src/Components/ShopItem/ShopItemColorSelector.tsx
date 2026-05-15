import { ShopItemColor } from '@/src/entities/ShopItem';
import React, { Dispatch, SetStateAction } from 'react';

type ShopItemColorSelectorProps = ShopItemColor & {
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
};

const ShopItemColorSelector = ({ code, avaliable, selected, setSelected }: ShopItemColorSelectorProps) => {
  return (
    <div
      className='w-8 h-8 rounded-full mx-1'
      onClick={() => avaliable && setSelected(code)}
      style={{
        backgroundColor: code,
        opacity: avaliable ? 1 : 0.5,
        border: `2px solid ${selected === code ? '#939393' : '#EBEBEB'}`
      }}
    />
  );
};

export default ShopItemColorSelector;