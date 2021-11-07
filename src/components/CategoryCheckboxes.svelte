<script>
  import fetcher from '../../scripts/fetcher';
  import CheckboxWithLabel from './CheckboxWithLabel.svelte';

  const KEY = 'PUBLIC_API_CATEGORIES';

  let defaultCategories = [];
  let keyword = '';
  $: categories =
    keyword === ''
      ? defaultCategories
      : defaultCategories.filter((category) =>
          category.toLowerCase().includes(keyword.toLowerCase())
        );

  if (sessionStorage.getItem(KEY)) {
    defaultCategories = JSON.parse(sessionStorage.getItem(KEY));
    categories = defaultCategories;
  } else {
    fetcher('/categories', function (res) {
      if (res) {
        sessionStorage.setItem(KEY, JSON.stringify(res));
        defaultCategories = res;
        categories = defaultCategories;
      }
    });
  }
</script>

<div class="category-widget">
  <h3>Filter by categories {keyword}</h3>
  <input
    class="w-full mb-4"
    placeholder="Search category"
    bind:value={keyword}
  />
  <div class="category-checkboxes" id="categoryOptions">
    {#each categories as category}
      <CheckboxWithLabel name="categories" {category} />
    {/each}
  </div>
</div>

<style>
  .category-widget {
    border: 1px solid #666;
    padding: 0 1rem 1rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .category-checkboxes {
    display: flex;
    flex-direction: column;
  }
</style>
