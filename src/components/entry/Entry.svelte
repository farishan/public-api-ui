<script>
  import StatusIcon from './StatusIcon.svelte';

  export let entry = {
    API: 'AdoptAPet',
    Auth: 'apiKey',
    Category: 'Animals',
    Cors: 'yes',
    Description: 'Resource to help get pets adopted',
    HTTPS: true,
    Link: 'https://www.adoptapet.com/public/apis/pet_list.html'
  };

  $: recommended = entry.Auth === '' && entry.HTTPS && entry.Cors === 'yes';
  $: notRecommended = entry.Auth !== '' && !entry.HTTPS && entry.Cors !== 'yes';
</script>

<article
  class="entry {recommended
    ? 'recommended'
    : notRecommended
    ? 'not-recommended'
    : ''}"
>
  <h3 class="entry__title flex items-center justify-between">
    <a href={entry.Link} target="_blank" rel="noopener noreferrer"
      >{entry.API}</a
    ><small class="entry__category">{entry.Category}</small>
  </h3>
  <p class="entry__description" title={entry.Description}>
    {entry.Description.length > 30
      ? entry.Description.substr(0, 30) + '...'
      : entry.Description}
  </p>
  <div
    class="flex items-center"
    style="font-size:0.75rem"
    title={`Auth: ${entry.Auth} | HTTPS: ${entry.HTTPS} | Cors: ${entry.Cors}`}
  >
    <span
      style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{entry.Auth ===
      ''
        ? 'green'
        : 'red'};"
    />
    <span style="margin:0 2px 0 4px">Auth</span>
    <StatusIcon truthy={entry.Auth === ''} />

    <span
      style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{entry.HTTPS
        ? 'green'
        : 'red'};"
    />
    <span style="margin:0 2px 0 4px">HTTPS</span>
    <StatusIcon truthy={entry.HTTPS} />

    <span
      style="display:inline-block;width:8px;height:8px;border-radius:50%;background:{entry.Cors ===
      'yes'
        ? 'green'
        : entry.Cors === 'no'
        ? 'red'
        : 'orange'};"
    />
    <span style="margin:0 2px 0 4px">CORS</span>
    <StatusIcon truthy={entry.Cors === 'yes'} />
  </div>
</article>

<style>
  .entry {
    /* border: 1px solid #666; */
    padding: 0 8px 8px;
    width: 100%;
    margin: 0 0.5rem 1rem;
    background-color: #fff;
  }

  @media screen and (min-width: 768px) {
    .entry {
      width: calc(50% - 1rem);
    }
  }

  @media screen and (min-width: 1280px) {
    .entry {
      width: calc(33.3333% - 1rem);
    }
  }

  .entry.recommended {
    border-right: 4px solid green;
  }

  .entry.not-recommended {
    border-right: 4px solid red;
  }

  .entry__title {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .entry__category {
    font-weight: 400;
    padding-left: 4px;
    text-align: right;
  }

  .entry__description {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #444444;
  }
</style>
