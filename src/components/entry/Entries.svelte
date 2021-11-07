<script>
  import { entries } from '../../../scripts/store';
  import Entry from './Entry.svelte';

  let showAll = $entries.length > 12 ? false : true;
</script>

<div class="entries">
  {#if !$entries || $entries === null || !$entries.length}
    <p class="info">No entry.</p>
  {/if}

  {#if showAll}
    {#each $entries as entry}
      <Entry {entry} />
    {/each}
  {:else}
    {#each $entries.slice(0, 12) as entry}
      <Entry {entry} />
    {/each}
  {/if}
</div>
{#if showAll === false}
  <div class="show-all">
    <button on:click={() => (showAll = true)}>Show All</button>
  </div>
{/if}

<style>
  .entries {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
  }
  .info {
    font-style: italic;
    margin: 2rem auto;
    color: #888888;
  }
  .show-all {
    text-align: center;
    margin: 2rem 0;
  }
</style>
