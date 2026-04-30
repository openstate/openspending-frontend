<script lang="ts">
  export let data
</script>
<h1>Antwoorden op Poll</h1>
<table class="table table-striped">
  <thead>
    <tr>
      <th>Nummer</th>
      <th>Datum</th>
      <th>Naam</th>
      <th>E-mailadres</th>
      <th>Rol</th>
      <th>Antwoord gevonden?</th>
      <th>Opmerkingen</th>
    </tr>
  </thead>
  <tbody>
    {#each data.responses as response}
    {@const date = (new Date(Date.parse(response.RespondedOn))).toLocaleString('nl')}
    <tr>
      <td>{response.ResponseId}</td>
      <td>{date}</td>
      <td>{response.Answers.filter(a => a.QuestionNumber == 4)[0]?.Answer ?? ''}</td>
      <td>{response.Answers.filter(a => a.QuestionNumber == 5)[0]?.Answer ?? ''}</td>
      <td>{response.Answers.filter(a => a.QuestionNumber == 1)[0].Answer}</td>
      <td>{response.Answers.filter(a => a.QuestionNumber == 2)[0].Answer ?? ''}</td>
      <td>{response.Answers.filter(a => a.QuestionNumber == 3)[0].Answer ?? ''}</td>
    </tr>
    {/each}
  </tbody>
</table>
