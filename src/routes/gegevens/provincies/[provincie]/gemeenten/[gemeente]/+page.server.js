import { error } from '@sveltejs/kit';

export function load({ params }) {
	// if (!post) throw error(404);
	return { ...params };
}
