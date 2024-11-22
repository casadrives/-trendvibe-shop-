<template>
  <div id="app">
    <nav-bar />
    <router-view />
    <chat-widget />
    <footer-component />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import FooterComponent from './components/FooterComponent.vue'
import ChatWidget from './components/ChatWidget.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'App',
  components: {
    NavBar,
    FooterComponent,
    ChatWidget
  },
  setup() {
    const store = useStore()
    const cartItemCount = computed(() => store.state.cart.items.length)

    return {
      cartItemCount
    }
  }
}
</script>

<style>
@import 'bootstrap/dist/css/bootstrap.min.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router-view-container {
  flex: 1;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

footer {
  margin-top: auto;
}
</style>
