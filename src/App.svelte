<script>
  import './index.css';
  import './normalize.css';
  import fetcher from '../scripts/fetcher';
  import Header from './components/Header.svelte';
  import Entries from './components/entry/Entries.svelte';
  import EntriesSkeleton from './components/entry/EntriesSkeleton.svelte';
  import FormRow from './components/form/FormRow.svelte';
  import MainLayout from './components/layout/MainLayout.svelte';
  import CategoryCheckboxes from './components/CategoryCheckboxes.svelte';
  import SelectedCategories from './components/SelectedCategories.svelte';
  import { entries, selectedCategories } from '../scripts/store';

  const DEFAULT_QUERY = '?auth=null&cors=yes&https=true';
  let isFetching = true;
  const cache = {
    init: []
  };
  let keyword = '';

  function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const debouncedGetByKeyword = debounce((keyword) => {
    const onlyWhitespace = !keyword.replace(/\s/g, '').length;

    if (!onlyWhitespace && isFetching === false) {
      isFetching = true;
      let newEntries = [];

      const titlePromise = new Promise((resolve) => {
        fetcher(`/entries?title=${keyword}`, function (res) {
          resolve(res);
        });
      });
      const descPromise = new Promise((resolve) => {
        fetcher(`/entries?description=${keyword}`, function (res) {
          resolve(res);
        });
      });

      Promise.all([titlePromise, descPromise])
        .then((res) => {
          res.forEach((resObj) => {
            if (resObj.count) {
              newEntries = [...newEntries, ...resObj.entries];
            }
          });
        })
        .finally(() => {
          isFetching = false;
          entries.set(newEntries);
        });
    }
  });

  $: if (keyword === '') {
    entries.set(cache.init);
  } else {
    debouncedGetByKeyword(keyword);
  }

  const debouncedGetByCategory = debounce((cacheKeys) => {
    const promises = [];
    let newEntries = [];

    cacheKeys.forEach((cacheKey) => {
      if (!cache[cacheKey]) {
        promises.push(
          new Promise((resolve, reject) => {
            fetcher(`/entries?category=${cacheKey}`, function (res) {
              if (res && res.entries) {
                cache[cacheKey] = res.entries;
                resolve(res);
              }
            });
          })
        );
      } else {
        newEntries = [...newEntries, ...cache[cacheKey]];
      }
    });

    if (promises.length) {
      isFetching = true;
      Promise.all(promises)
        .then((res) => {
          res.forEach((byCat) => {
            newEntries = [...newEntries, ...byCat.entries];
          });
        })
        .finally(() => {
          isFetching = false;
          entries.set(newEntries);
        });
    } else {
      isFetching = false;
      entries.set(newEntries);
    }
  });

  selectedCategories.subscribe((value) => {
    if (isFetching === false) {
      debouncedGetByCategory(value);
    }
  });

  fetcher('/entries' + DEFAULT_QUERY, function (res) {
    // fetcher('/random', function (res) {
    if (res && res.entries) {
      cache.init = res.entries;
      entries.set(res.entries);
    }

    isFetching = false;
  });
</script>

<svelte:head>
	<title>Public APIs User Interface</title>
	<html lang="en" />
</svelte:head>

<Header />

<MainLayout>
  <svelte:fragment slot="main">
    <SelectedCategories />
    {#if isFetching}
      <EntriesSkeleton />
    {:else}
      <Entries />
    {/if}
  </svelte:fragment>
  <svelte:fragment slot="aside">
    <div class="sticky top-0">
      <FormRow>
        <input
          class="w-full border"
          placeholder="Search"
          bind:value={keyword}
        />
      </FormRow>
      <CategoryCheckboxes />
    </div>
  </svelte:fragment>
</MainLayout>

<style>
  .border {
    border: 1px solid #666;
  }
</style>
