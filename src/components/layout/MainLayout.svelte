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
  }

  .main {
    padding-right: 2rem;
    width: 100%;
  }

  @media screen and (min-width: 1024px) {
    .sidebar {
      min-width: 25%;
    }
  }
</style>
