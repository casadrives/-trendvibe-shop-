<template>
  <div class="min-h-screen flex flex-col">
    <nav-bar></nav-bar>
    <main class="flex-grow">
      <router-view></router-view>
    </main>
    <footer-component></footer-component>
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
@import './assets/main.css';
</style>
