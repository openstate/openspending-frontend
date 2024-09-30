<script>
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
	import { loginEnabled } from '../stores';
  $: session = $page.data.session;
  import logo_openstate_wit from '$lib/assets/logo-openstate-wit.png';
	import { PersonCircle } from 'svelte-bootstrap-icons';
</script>

  <section class="topbar d-flex flex-row justify-content-start fixed-top">
    <div class="d-flex container-fluid align-items-center">
      <div class="d-flex align-items-center">
        <img src="{logo_openstate_wit}" alt="Logo Open State Foundation" width="100"/>
        <div class="line"></div>
        <a href="https://openstate.eu/nl/doneren/" class="btn button-help-mee">Help mee</a>
      </div>
    </div>
    <div class="d-flex float-end p-1 align-items-center">
      {#if get(loginEnabled) === 'true' && session.Token}
      <a href="/uitloggen" class="btn btn-primary btn-sm" style="width: 110px;"><PersonCircle/> Uitloggen</a>
      {/if}
    </div>
  </section>
<div class="topbar-container d-flex flex-row fixed-top">
</div>
<style>
  .topbar-container {
    margin-top: 40px;
    height:20px;
    background-color: var(--white);
    opacity: 0.8;
  }
  .topbar {
      background-color: var(--primary-color);
      height: 40px;
  }

  .line {
      width: 2px;
      height: 30px;
      background-color: var(--white);
      margin-left: 15px;
      margin-right: 15px;
  }

  .button-help-mee {
      background-color: var(--white);
      color: var(--primary-color);
      margin: 2px;
      padding: 2px 5px 2px 5px;
      font-size: 12px;
      border-radius: var(--border-radius);
      font-weight: 500;
  }
</style>
