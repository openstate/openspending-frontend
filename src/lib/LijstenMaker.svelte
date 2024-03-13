<script lang="ts">
	import { onMount } from 'svelte';

	export let choices: Record<string, string | number>
	export let value: string = '';
	export let onchange: (key: string, value : string | number) => void = () => {};
	export var defaultValue: string | undefined = undefined;
	const kies = (event: Event) => {
		value = (event.target as HTMLElement).innerText;
		const realValue = choices[value]
		onchange(value, realValue)
	};
	onMount(() => {
		value = defaultValue ?? Object.keys(choices)[0];
	});
</script>

<div class="btn-group">
	<a
		class="fw-bold dropdown-toggle display-6"
		href={'#'}
		role="button"
		data-bs-toggle="dropdown"
		aria-expanded="false"
	>
		{defaultValue}
	</a>
	<ul class="dropdown-menu">
		{#each Object.keys(choices) as choice}
			<li class="dropdown-item"><a href={'#'} on:click={kies}>{choice}</a></li>
		{/each}
	</ul>
</div>

<style>
	a,
	a:hover {
		color: var(--magenta);
		border: none;
		margin: 0;
		padding-bottom: 0.2em;
	}

	a.dropdown-toggle::after {
		display: inline-block;
		margin-left: 0.1em;
		margin-right: 0.2rem;
		margin-right: 0.2rem;
		content: '';
		border-top: 0.2em solid;
		border-right: 0.2em solid transparent;
		border-bottom: 0;
		border-left: 0.2em solid transparent;
	}

	.dropdown-item a {
		font-size: 1.5rem;
		color: var(--purple);
	}
</style>
