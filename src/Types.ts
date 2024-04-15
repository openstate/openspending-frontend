export type SourceType = 'Gemeenten' | 'Provincies' | 'GemeenschappelijkeRegelingen' | 'Waterschappen'
export type Verslagsoort = 'begroting' | 'realisatie' | 'Q1' | 'Q3' | 'Q3' | 'Q4'

export interface Bron {
	Key: string
	Title: string
	Slug: string
	Description: string
	Type: SourceType
  hasDetaildata: boolean
};

export interface DataSet {
	Identifier: string
	Period: number
	Title: string
	Summary: string
	SourceType: SourceType
	StatLine: string
	$link: string
  hasDetaildata: boolean
}

export interface DatasetTotals {
  Baten: number | null,
  Lasten: number | null,
  Standen: number | null
}

export interface SingleDataSet extends DataSet {
	verslagsoorten: Verslagsoort[]
	totaal: DatasetTotals
}

export interface BronMetDatasets extends Bron {
  datasets: DataSet[]
}

export interface BedragenPerCategorie {
	Title: string,
	PL1: number,
	PL2: number
	Key?: string
	ID?: number
}

export interface BronData {
	ID: string
	Title: string
	Code: string,
	Description: string | null
	$link?: string
	Lasten?: number | null
	Baten?: number | null
	Standen?: number | null,
	data?: BronData[]
}

export interface DetailData {
  ID: number
  Categorie: string
  Verslagsoort: string
  Bedrag: number,
  BL: "B" | "L"
  Post: string
  Grootboek: string
  GrootboekOmschrijving: string
  Kostenplaats: string
  KostenplaatsOmschrijving: string
  PostOmschrijving: string
  CategorieOmschrijving: string
}

export interface BronDetail extends Bron {
	metrics?: {
		Bevolking: number,
		Oppervlakte: number,
		Huishouden: number
	},
	$links: {
		realisatie?: string,
    begroting?: string,
    Q4?: string,
    Q3?: string,
    Q2?: string,
    Q1?: string
	},
	Verslagsoort: Verslagsoort
	dataset: SingleDataSet,
	datasets: DataSet[],
	data: BronData[]
}

export interface BronDetailVergelijk extends Omit<BronDetail, 'data'> {
	data: BronData[][]
}

export type Adres = {
  Description: string
  Slug: string
  lat: number
  lon: number
  adres: string,
  werkgebieden: Array<{
    Slug: string
    Title: string 
    Type: SourceType
  }>
}