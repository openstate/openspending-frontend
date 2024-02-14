// const api = import.meta.env.PROD
// 		? 'https://data.openspending.nl'
// 		: 'http://localhost:3000'
    
export async function load({ params }) {
  return { params }
}