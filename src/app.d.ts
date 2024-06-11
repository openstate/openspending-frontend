// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace Chart {}
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "$env/static/public" {
  export const ENABLE_DETAILDATA: string;
  export const LINK_SHORTENER: string
}


export {};
