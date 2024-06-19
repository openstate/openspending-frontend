<script lang="ts">
  import { Mastodon, TwitterX, Linkedin, Github, EnvelopeFill } from 'svelte-bootstrap-icons';
  import OSFLogo from '$lib/assets/logo-openstate.png';
  import OSLogo from '$lib/assets/open-spending.svg';
</script>

<!-- Footer -->
<footer class="footer mt-auto py-3 bg-body-tertiary text-body-tertiary">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-4 col-md-4 col-sm-12">
        Deze website is onderdeel van<br>
        <a href="https://openstate.eu"><img src="{OSFLogo}" alt="Logo Open State Foundation" width="120"></a>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 text-center socials">
				<a href="https://mastodon.nl/@OpenState" title="Open State Foundation | Mastodon" ><Mastodon/></a>
				<a href="https://twitter.com/OpenStateEU" title="Open State Foundation | X/Twitter" ><TwitterX/></a>
				<a href="https://www.linkedin.com/company/open-state-foundation/" title="Open State Foundation | LinkedIn" ><Linkedin/></a>
				<a href="https://github.com/OpenState" title="Open State Foundation | Github" ><Github/></a>
				<a href="https://openstate.eu/nl/contact/" title="Open State Foundation | Email" ><EnvelopeFill/></a>
      </div>
      <div class="col-lg-4 col-md-4 col-sm-12 text-end">
        <img src="{OSLogo}" alt="Logo Open Spending" style="height:36px;">
      </div>
    </div>
  </div>
</footer>

<style>
	div.socials a {
    padding: 0 3px 0 3px;
	}
	div.socials a:hover {
    color: var(--purple);
	}

	footer {
		/* margin-top: 20px; */
		border-top: solid var(--purple) 1px;
	}
</style>
