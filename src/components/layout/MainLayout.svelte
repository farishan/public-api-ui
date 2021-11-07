<div class="main-wrapper container--fluid flex">
  <main class="main">
    <slot name="main" />
  </main>
  <aside class="sidebar relative">
    <slot name="aside" />
  </aside>
</div>

<style>
  .main-wrapper {
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .main {
    width: 100%;
    order: 2;
  }

  .sidebar {
    order: 1;
    width: 100%;
    margin-bottom: 2rem;
  }

  @media screen and (min-width: 768px) {
    .main-wrapper {
      flex-wrap: nowrap;
    }

    .main {
      padding-right: 2rem;
      order: 1;
    }

    .sidebar {
      order: 2;
      width: 25%;
      margin-bottom: 0;
    }
  }
</style>
