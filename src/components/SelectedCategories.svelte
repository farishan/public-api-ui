<script>
  import {
    selectedCategories,
    removeSelectedCategory
  } from '../../scripts/store';
</script>

<div class="selected-categories {$selectedCategories.length ? 'filled' : ''}" id="selectedCategories" style="width: 70%">
  {#each $selectedCategories as category}
    <span
      class="selected-category"
      on:click={() => removeSelectedCategory(category)}>{category}</span
    >
  {/each}
</div>

<style>
  .selected-categories {
    display: flex;
    flex-wrap: wrap;
  }

  .filled {
    margin-bottom: 1rem;
  }

  .selected-category {
    padding: 4px 8px;
    border: 1px solid #666;
    font-size: 0.75rem;
    user-select: none;
    cursor: pointer;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
    background-color: #222;
    color: #fff;
  }

  .selected-category:hover {
    background-color: #444444;
    transform: scale(1.1);
  }

  .selected-category::after {
    content: 'x';
    margin-left: 8px;
  }
</style>
