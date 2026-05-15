export type CountriesType = {
	[key: string]: {
		states: StatesType,
		code: string,
		phoneCode: string,
		emojiU: string
	}
}

export type StatesType = {
	[key: string]: {
		cities: string[]
	}
}