const rq = `
select ?provincieLabel ?vlag ?location where {
  ?provincie p:P31 ?instanceOf; p:P41/ps:P41 ?vlag; wdt:P625 ?location .
  ?instanceOf ps:P31 wd:Q134390.
  service wikibase:label { bd:serviceParam wikibase:language "nl". }
}
`

type Iri = {
  value: string
}
type Binding = {
  provincieLabel: Iri,
  vlag: Iri,
  location: Iri
}

export async function load({ fetch }) {
    return fetch('https://query.wikidata.org/sparql?query=' + encodeURIComponent(rq), {
      headers: {
        Accept: 'application/sparql-results+json'
      }
    })
		.then((response) => {
			if (!response.ok)
			return { error: 'Failed to load provincie from API: ' + response.statusText };
			return response.json();
		})
		.then((data) => {
      return data.results.bindings as Binding[]
    })
    .then(async bindings => {
      const provinces = await fetch('/data/provinces.geojson').then(res => res.json())
      return { bindings, provinces}
    });
}