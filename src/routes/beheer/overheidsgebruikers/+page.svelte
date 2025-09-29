<script lang="ts">
	import { goto } from "$app/navigation";
	import { X, XLg, Plus } from 'svelte-bootstrap-icons';

	export let data
</script>

<h1>Beheer overheidsgebruikers</h1>

<button class="btn btn-primary btn-lg" type="button" on:click={() => goto('/beheer/overheidsgebruikers/nieuw')}>
	Toevoegen
</button>

<h2 class='mt-5'>Lijst van bestaande overheidsgebruikers</h2>
<table class="table table-hover table-striped">
	<thead>
		<tr>
			<th>Gebruikersnaam</th>
			<th>Voornaam</th>
			<th>Achternaam</th>
			<th>Gekoppelde bronnen</th>
			<th>Acties</th>
		</tr>
	</thead>
	<tbody>
{#each data.users as user}
		<tr>
			<td>{user.Username}</td>
			<td>{user.Firstname}</td>
			<td>{user.Lastname}</td>
			<td>
				<button class='border-0 btn btn-sm'
					on:click={() => goto(`/beheer/overheidsgebruikers/${user.Username}/bronnen`)}
					title='Klik om gebruiker aan een nieuwe bron toe te voegen'
				>
					<Plus color='green' style="cursor: pointer;" width={24} height={24} />
				</button>
				{#if user.Sources.length == 1}
					{user.Sources[0].Title}
				{:else}
					{#each user.Sources as source, index}
						{source.Title}
						<button class='border-0 btn btn-sm'
							on:click={() => goto(`/beheer/overheidsgebruikers/${user.Username}/${source.Key}`)}
							title='Klik om gebruiker te ontkoppelen van deze bron'
						>
							<X color='red' style="cursor: pointer;" width={24} height={24} />
						</button>
						{#if (index < user.Sources.length - 1)}
						<span class='me-2'>,</span> 
						{/if}
					{/each}
				{/if}
			</td>
			<td>
				<button class='border-0 btn'
					on:click={() => goto(`/beheer/overheidsgebruikers/${user.Username}`)}
					title='Klik om gebruiker te verwijderen'
				>
				<XLg color='red' style="cursor: pointer;" />
				</button>
			</td>
		</tr>
{/each}
	</tbody>
</table>
