export type ShopItem = {
	id: string;
	title: string;
	category: {
		name: string;
		slug: string;
		shippingCost: number;
	};
	thumbnail: string;
	thumbnailHeight: number;
	genre: string;
	description: string;
	sku: string;
	isNew: boolean;
	price: number;
	type: string;
	quantity: number;
	images: string[];
	stock: number;
	color: string;
	size: string;
	purpose: string;
	colors: ShopItemColor[];
	sizes: ShopItemSize[];
	slug: string
};

export type ShopItemColor = {
	color: string;
	code: string;
	avaliable: boolean;
};

export type ShopItemSize = {
	size: string;
	available: boolean;
};