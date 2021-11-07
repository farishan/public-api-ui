<script>
  import EntrySkeleton from './EntrySkeleton.svelte';
</script>

<div class="entries">
  {#each Array(24) as _, i}
    <EntrySkeleton />
  {/each}
</div>

<style>
  .entries {
    display: flex;
    flex-wrap: wrap;
    flex-wrap: wrap;
    margin: 0 -0.5rem;
  }
</style>
