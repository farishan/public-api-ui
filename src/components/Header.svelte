<script>
  import DarkToggler from './DarkToggler.svelte';
</script>

<header class="header">
  <div class="container--fluid">
    <div class="header__flexbox flex flex-wrap justify-between">
      <div class="flex flex-wrap items-center">
        <h1>
          Public APIs
          <small class="api-status" id="apiStatus">BETA</small>
        </h1>
        <h2>
          Unofficial User Interface for
          <a
            href="https://api.publicapis.org/"
            target="_blank"
            rel="noopener noreferrer">Public API for Public APIs</a
          >
        </h2>
      </div>
      <div>
        <DarkToggler />
      </div>
    </div>
  </div>
</header>

<style>
  .header {
    padding: 1rem 0;
  }

  .header h1,
  .header h2 {
    margin: 0;
  }

  .header h1 {
    padding-right: 1rem;
    margin-right: 1rem;
    margin-bottom: 2rem;
  }

  .header h2 {
    font-size: 1rem;
    font-weight: 400;
  }

  .header__flexbox {
    flex-wrap: nowrap;
  }

  .api-status {
    font-size: 0.5rem;
    padding: 2px 8px;
    position: relative;
    top: -18px;
    margin-left: 4px;
    background-color: darkred;
    color: #fff;
  }

  @media screen and (min-width: 768px) {
    .header h1 {
      margin-bottom: 0;
      border-right: 1px solid #666;
    }
  }
</style>
