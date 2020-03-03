<template>
  <div id="app">
    
    <game></game>
  </div>
</template>

<script>
import Game from './components/Game.vue';

export default {
  
  components: {
    Game,
  },
};
</script>

<style>
#app {
  font-family: 'Lato', Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
