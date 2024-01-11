<script lang="ts">
	import warn from 'bootstrap-icons/icons/exclamation-circle-fill.svg';
	import ok from 'bootstrap-icons/icons/envelope-check-fill.svg';
	import { onMount } from 'svelte';
	const validate = (event: SubmitEvent) => {
		const form = event.target as HTMLFormElement;
		if (!form.checkValidity()) {
			event.preventDefault();
			event.stopPropagation();
		}
		form.classList.add('was-validated');
	};
	onMount(() => {
		Array.from(document.querySelectorAll('.form-control')).forEach(
			(input) => ((input as HTMLFormElement).name = input.id)
		);
	});

	export let form;
</script>

<h1>Contact</h1>
<p class="lead">
	openspending.nl is een onderdeel van de <a href="https://openstate.eu">Open State Foundation</a>,
	een organisatie die democratische transparantie, verantwoording en participatie bevordert door het
	ontwikkelen van online platformen en het bevorderen van het ontsluiten en gebruik van open data.
</p>
{#if form?.success}
	<div class="form-container alert alert-success">
		<p class="fw-bold">
			<img aria-hidden="true" src={ok} alt="" />
			Bedankt voor uw bericht, indien nodig nemen we contact met u op.
		</p>
	</div>
{:else}
	<h2 class="fs-5">
		Voor meer informatie over Open Spending kunt u onderstaand formulier invullen:
	</h2>
	<div class="form-container">
		{#if form?.success === false}
			<div class="alert alert-warning" role="alert">
				<img aria-hidden="true" src={warn} alt="" />
				{form?.message}
			</div>
		{/if}
		<form method="POST" on:submit={validate} novalidate>
			<div class="form-floating mb-3">
				<input
					required
					type="text"
					class="form-control form-control-lg"
					id="naam"
					placeholder="typ uw naam&hellip;"
					value={form?.data?.naam ?? ''}
				/>
				<label for="naam" class="form-label">Naam</label>
			</div>
			<div class="form-floating mb-3">
				<input
					required
					type="email"
					class="form-control form-control-lg"
					id="email"
					placeholder="typ uw e-mailadres&hellip;"
					value={form?.data?.email ?? ''}
				/>
				<label for="email" class="form-label">E-mailadres</label>
			</div>
			<div class="form-floating mb-3">
				<input
					required
					type="text"
					class="form-control form-control-lg"
					id="onderwerp"
					placeholder="typ een onderwerp&hellip;"
					value={form?.data?.onderwerp ?? ''}
				/>
				<label for="onderwerp" class="form-label">Onderwerp</label>
			</div>
			<div class="form-floating mb-3">
				<textarea
					required
					style="height: 150px;"
					class="form-control form-control-lg"
					id="bericht"
					rows="3"
					placeholder="typ uw bericht&hellip;">{form?.data?.bericht ?? ''}</textarea
				>
				<label for="bericht" class="form-label">Bericht</label>
			</div>
			<button type="submit" class="btn btn-primary">Verstuur</button>
		</form>
	</div>
{/if}

<style>
	div.form-container {
		max-width: 600px;
	}
</style>
