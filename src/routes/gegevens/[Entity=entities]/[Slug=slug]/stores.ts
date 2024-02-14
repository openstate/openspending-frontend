import { writable } from 'svelte/store';

export const periode = writable<number>(new Date().getFullYear());
export const verslagsoort = writable<'begroting' | 'realisatie' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('begroting')
export const groepering = writable<'hoofdfunctie' | 'categorie'>('categorie')
export const baten_of_lasten = writable<'lasten' | 'baten'>('baten')
