<template>
  <div id="app">
    <v-app>
      <main>
        <nav style="backgroundColor: #B7410E;" class="navbar justify-content-center">
          <a :href="rentifyPage" class="navbar-brand" style="color:white">Rentify</a>
        </nav>  

        <router-view />
        <footer
          class="fixed-bottom text-center text-lg-start"
          style="background-color: #f0f0f0"
        >
          <div
            class="text-center text-white p-3"
            style="background-color: rgba(0, 0, 0, 0.2)"
          >
            © 2023 Copyright:
            <a class="text-white" :href="rentifyPage">Rentify.com</a>
          </div>
        </footer>
      </main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "app",
  setup() {
    return {
      rentifyPage: 'http://localhost:8080',
    };
  },
};
</script>
