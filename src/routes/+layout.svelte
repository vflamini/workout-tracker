<script lang='ts'>
  let { children } = $props();
  let selectedRoute = $state('/');

  function selectRoute(route: string) {
    selectedRoute = route;
  }
</script>

{#snippet navbarElement(route: string, label: string)}
  <li><a 
    class={{selected: selectedRoute === route}} 
    onclick={() => selectRoute(route)} 
    href={route}>
      {label}
    </a>
  </li>
{/snippet}

<div class='app'>
  <header>
    <nav>
      <ul>
        <li>
          <button>Profile</button>
        </li>
      </ul>
    </nav>
  </header>
  <aside>
    <nav>
      <ul>
        {@render navbarElement('/', 'Dashboard')}
        {@render navbarElement('/create-workout', 'Create Workout')}
        {@render navbarElement('/create-exercise', 'Create Exercise')}
        {@render navbarElement('/my-stats', 'My Stats')}
      </ul>
    </nav>
  </aside>
  <main>
    {@render children()}
  </main>
</div>

<style>
  div.app {
    display: grid;
    grid-template-areas: 
      "header header"
      "sidebar content";
    grid-template-columns: 15% 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
  }

  header {
    grid-area: header;
    height: 30px;
    border-bottom: 1px solid gray;
    background-color: #665166;
  }

  aside {
    grid-area: sidebar;
    height: 100vh;
    padding-top: 35px;
    background-color: transparent;
    border-right: 1px solid gray;
    margin: 0;
    padding: 0;
  }

  aside nav ul li {
    margin: 5px;
  }

  aside nav ul li a {
    color: gray;
    height: 100%;
    display: block;
    padding: 5%;
    border-radius: 5px;
  }

  aside nav ul li a:hover {
    background-color: #363436;
  }

  aside nav ul li a.selected {
    background-color: #8b758b;
    color: white;
  }

  aside nav {
    padding: 10px;
  }

  main {
    grid-area: content;
    padding: 10px;
    overflow-y: auto;
    height: calc(100vh - 60px);
  }
</style>