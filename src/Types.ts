export interface Source {
	Key: string
	Title: string;
	Slug: string;
	$link: string;
};
export type SourceType = 'Gemeenten' | 'Provincies' | 'GemeenschappelijkeRegelingen' | 'Waterschappen'
export type Verslagsoort = 'begroting' | 'realisatie' | 'Q1' | 'Q3' | 'Q3' | 'Q4'

export interface DataSet {
	Identifier: string
	Period: number
	Title: string
	Summary: string
	SourceType: SourceType
	StatLine: string
	$link: string
}

export interface SingleDataSet extends DataSet {
	verslagsoorten: Verslagsoort[]
}

export interface SourceWithDatasets extends Source {
  datasets: DataSet[]
}

export interface BedragenPerCategorie {
	Title: string,
	PL1: number,
	PL2: number
	Key?: string
	ID?: number
}
export interface BronDetail extends Source {
	metrics: {
		Bevolking: number,
		Oppervlakte: number,
		Huishouden: number
	},
	dataset: SingleDataSet,
	totaal: {
		Baten: {
			PL1: number
			PL2: number
		},
		Lasten: {
			PL1: number
			PL2: number
		},
		Standen?: {
			PL1: number
			PL2: number
		}
	}
	Lasten: BedragenPerCategorie[]
	Baten:  BedragenPerCategorie[]
	Standen?:  BedragenPerCategorie[]
}
