export interface Source {
	Key: string
	Title: string;
	Slug: string;
	$link: string;
	PeriodRange: {
		min: number;
		max: number;
	};
};

export interface SourceWithDatasets extends Source {
  $datasets: Array<{
    Identifier: string, 
    Period: number
  }>
}