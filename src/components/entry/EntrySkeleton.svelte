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
</script>

<article class="entry recommended">
  <h4 class="entry__title grey flex items-center justify-between">
    <span>{entry.API}</span><small class="entry__category grey"
      >{entry.Category}</small
    >
  </h4>
  <p class="entry__description grey" title={entry.Description}>
    {entry.Description.substr(0, 30) + '...'}
  </p>
  <div class="flex items-center" style="font-size:0.75rem">
    <div class="flex items-center grey" title="Auth">
      <span
        style="display:inline-block;width:8px;height:8px;border-radius:50%;background:green;"
      />
      <span style="margin:0 2px 0 4px">Auth</span>
      <StatusIcon truthy={entry.Auth === ''} />
    </div>
    <div
      class="flex items-center grey"
      title="HTTPS: {entry.HTTPS ? 'Yes' : 'No'}"
      style="margin:0 8px; padding: 0 8px; border-right: 1px solid; border-left: 1px solid;"
    >
      <span
        style="display:inline-block;width:8px;height:8px;border-radius:50%;background:green;"
      />
      <span style="margin:0 2px 0 4px">HTTPS</span>
      <StatusIcon truthy={entry.HTTPS} />
    </div>
    <div class="flex items-center grey" title="CORS: {entry.Cors}">
      <span
        style="display:inline-block;width:8px;height:8px;border-radius:50%;background:green;"
      />
      <span style="margin:0 2px 0 4px">CORS</span>
      <StatusIcon truthy={entry.Cors === 'yes'} />
    </div>
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

  .entry__title {
    margin-top: 8px;
    margin-bottom: 8px;
  }

  .entry__category {
    font-weight: 400;
  }

  .entry__description {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .grey {
    animation: shine 1s linear infinite;
  }

  @keyframes shine {
    0% {
      color: #222;
      background-color: #222;
    }
    50% {
      color: #666;
      background-color: #666;
    }
    100% {
      color: #222;
      background-color: #222;
    }
  }
</style>
