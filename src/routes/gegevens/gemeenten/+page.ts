const rq = `
#Kaart en lijst van gemeenten in Nederland
#Concise list & map of the 355 Dutch municipalities, their geo coordinates and their provinces, per 1-1-2019
#See also: 
#https://almanak.overheid.nl/organisaties/Gemeenten/ - 355 in aantal
#https://nl.wikipedia.org/wiki/Lijst_van_Nederlandse_gemeenten - 355 in aantal

#defaultView:Map
select ?provincieLabel ?vlag ?gemeenteLabel ?location where {
  ?gemeente p:P31 ?instanceOf; # Get statement because we need this later
        wdt:P625 ?location. # And location
  ?instanceOf ps:P31 wd:Q2039348. # P31 should be 'municipality of the Netherlands'
  optional {
    ?gemeente p:P41/ps:P41 ?vlag .
  }
  ?gemeente p:P131 ?prov .
  ?prov pq:P3831 wd:Q134390; ps:P131 ?provincie .
  minus { ?gemeente wdt:P31 wd:Q7265977. } # Don't show former municipalities
  minus { ?instanceOf pq:P582 ?endTime. } # And don't show municipalities that have an end time
  service wikibase:label { bd:serviceParam wikibase:language "nl". }
} order by ?provincieLabel ?gemeenteLabel
`;

type Iri = {
  value: string
}
type Binding = {
  provincieLabel: Iri,
  vlag?: Iri,
  gemeenteLabel: Iri,
  location: Iri
}

export async function load ({fetch}) {
	return await fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(rq), {
		headers: {
			Accept: 'application/sparql-results+json'
		}
	})
		.then((response) => {
			if (!response.ok)
				return { error: 'Failed to load gemeentes from API: ' + response.statusText };
			return response.json();
		})
		.then((data) => {
      return {bindings: data.results.bindings as Binding[]}
    });
}
