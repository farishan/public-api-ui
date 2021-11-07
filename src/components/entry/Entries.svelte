<script>
  import { entries } from '../../../scripts/store';
  import Entry from './Entry.svelte';
</script>

<div class="entries">
  {#if !$entries || $entries === null || !$entries.length}
    <p class="info">No entry.</p>
  {/if}

  {#each $entries as entry}
    <Entry {entry} />
  {/each}
</div>

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
</style>
