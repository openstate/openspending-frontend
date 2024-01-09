<script>
  import mastodon from 'bootstrap-icons/icons/mastodon.svg'
  import x from 'bootstrap-icons/icons/twitter-x.svg'
  import linkedin from 'bootstrap-icons/icons/linkedin.svg'
  import github from 'bootstrap-icons/icons/github.svg'
  import email from 'bootstrap-icons/icons/envelope-fill.svg'
	import { onMount } from 'svelte';

  onMount(() => {
    Array.from(document.querySelectorAll('div.socials a img'))
      // @ts-ignore
      .forEach(img => img.title = img.alt)
  })
</script>
<style>
  div.col {
    margin:auto 0px;
  }
  div.socials a img {
    height: 24px;
    margin: 8px;
    filter: invert(49%) sepia(0%) saturate(905%) hue-rotate(233deg) brightness(102%) contrast(99%);
  }
  div.socials a img:hover {
    height: 24px;
    margin: 8px;
    filter: none;
  }

  footer {
    margin-top: 20px;
    border-top: solid var(--purple) 1px;
  }

</style>
<footer class="bg-light">
  <div class="container">
    <div class="row">
      <div class="col">
        <a href="/"><img style="height: 50px;" src="/images/openspending-logo.svg" alt="Open Spending Logo"></a>
      </div>
      <div class="col socials">
        <a href="https://mastodon.nl/@OpenState"><img src={mastodon} alt="Open State Foundation | Mastodon"></a>
        <a href="https://twitter.com/OpenStateEU"><img src={x} alt="Open State Foundation | X/Twitter"></a>
        <a href="https://www.linkedin.com/company/open-state-foundation/"><img src={linkedin} alt="Open State Foundation | LinkedIn"></a>
        <a href="https://github.com/OpenState"><img src={github} alt="Open State Foundation | Github"></a>
        <a href="https://openstate.eu/nl/contact/"><img src={email} alt="Open State Foundation | Email"></a>
      </div>
      <div class="col">
        <a href="https://openstate.eu" class="float-end"><img style="height: 80px;"  src="/images/logo-open-state-foundation.svg" alt="Open State Logo"></a>
      </div>
    </div>
  </div>
</footer>