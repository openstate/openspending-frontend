import { error, redirect } from '@sveltejs/kit';
export async function load({ params }) {
  switch(params.Page) {
    case 'data':
    case 'over':
    case 'faq':
      throw redirect(301, `/${params.Page}`);
    default:
      throw error(404)
  }
}