export type Article = {
	id: string;
	slug: string;
	title: string;
	content: string;
	image: string;
	thumbnail: string;
	month: string;
	link: string;
	theme: string;
	sections: Section[];
};

export type Section = {
	title: string;
	content?: string;
	image?: Image;
};

export type Image = {
	url: string;
	width: number;
	height: number;
}