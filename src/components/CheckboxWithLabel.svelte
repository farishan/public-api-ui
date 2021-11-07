<script>
  import {
    selectedCategories,
    addSelectedCategory,
    removeSelectedCategory
  } from '../../scripts/store';

  export let name;
  export let category;

  function handleSelectedCategory(value, checked) {
    if (checked && !$selectedCategories.includes(value)) {
      addSelectedCategory(value);
    }

    if (!checked && $selectedCategories.includes(value)) {
      removeSelectedCategory(value);
    }

    // fetchSelectedCategories();
  }

  const handleChange = (e) =>
    handleSelectedCategory(e.target.value, e.target.checked);
</script>

<label class="flex items-center">
  <input
    type="checkbox"
    id="checkbox_{category}"
    {name}
    value={category}
    checked={$selectedCategories.includes(category)}
    on:change={handleChange}
  />
  <span>{category}</span>
</label>

<style>
  input[type='checkbox'] {
    min-height: 24px;
    min-width: 24px;
  }

  label {
    cursor: pointer;
    padding: 8px 0;
  }

  label:hover span {
    text-decoration: underline;
  }

  label span {
    margin-left: 4px;
  }
</style>
