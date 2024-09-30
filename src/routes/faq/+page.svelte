<script lang="ts">
  import { marked } from 'marked'
  export let data;
  const antwoord = (Antwoord: string) => marked.parse(Antwoord)
</script>
<h1>{data.Titel}</h1>
<div class="row">
  <div class="col col-sm-12 col-md-12 col-lg-9">
    <div class="accordion">
    {#each data.FAQ as FAQ} 
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#faq-{FAQ.id}"
            aria-expanded="false"
            aria-controls="faq-{FAQ.id}"
          >
            {FAQ.Vraag}
          </button>
        </h2>
        <div id="faq-{FAQ.id}" class="accordion-collapse collapse">
          <div class="accordion-body">{@html antwoord(FAQ.Antwoord)}</div>
        </div>
      </div>
    {/each}
    </div>
  </div>
</div>
