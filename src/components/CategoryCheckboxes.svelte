<script>
  import fetcher from "../../scripts/fetcher";
  import CheckboxWithLabel from "./CheckboxWithLabel.svelte";

  const KEY = "PUBLIC_API_CATEGORIES";

  let defaultCategories = [];
  let keyword = "";

  if (sessionStorage.getItem(KEY)) {
    const savedCategories = JSON.parse(sessionStorage.getItem(KEY));
    if (savedCategories) {
      defaultCategories = savedCategories;
      categories = defaultCategories;
    } else {
      console.log("Something went wrong", { savedCategories });
    }
  } else {
    fetcher("/categories", function (res) {
      if (res && res.categories) {
        sessionStorage.setItem(KEY, JSON.stringify(res.categories));
        defaultCategories = res.categories;
        categories = defaultCategories;
      } else {
        console.log("Something went wrong", { res });
      }
    });
  }

  $: categories =
    keyword === ""
      ? defaultCategories
      : defaultCategories.filter((category) =>
          category.toLowerCase().includes(keyword.toLowerCase())
        );
</script>

<div class="category-widget">
  <h3>Filter by categories {keyword}</h3>
  <input
    class="w-full mb-4"
    placeholder="Search category"
    bind:value={keyword}
  />
  <div class="category-checkboxes" id="categoryOptions">
    {#if categories}
      {#each categories as category}
        <CheckboxWithLabel name="categories" {category} />
      {/each}
    {/if}
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
