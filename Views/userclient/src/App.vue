<template>
  <div id="app">
    <v-app>
      <main>
        <nav style="backgroundColor: #111828;" class="navbar justify-content-center">
          <a :href="evacluePage" class="navbar-brand" style="color:white"><img src="../public/logo.png" class="h-5 mr-3" alt="Flowbite Logo"></a>
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
            <a class="text-white" :href="evacluePage">www.evaclue.com</a>
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
      evacluePage: 'http://localhost/',
    };
  },
};
</script>
