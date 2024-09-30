// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Session } from 'svelte-kit-cookie-session';
import type { SessionData } from './Types';

declare global {
	namespace Chart {}
	namespace App {
		// interface Error {}
    interface Locals {
			session: Session<SessionData>;
		}	
    interface PageData {
			// can add any properties here, return it from your root layout
			session: SessionData;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "$env/static/public" {
  export const ENABLE_DETAILDATA: string;
  export const LINK_SHORTENER: string
}


export {};
