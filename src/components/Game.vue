<template>
  <div class="play" ref="play" style="width: 100%;">
    <entry v-on:newName="nameThisPlayer"></entry>

    <div class="center">
      <board></board>
    </div>
    <div class="center">
      <playing-zone :name="name" :launch="launch" :display="display"></playing-zone>
    </div>
  </div>
</template>

<script>
import Entry from './Entry.vue'
import Board from './Board.vue'
import PlayingZone from './PlayingZone.vue'
import { Store } from '../store/index'
//import { Player } from '../models/player.model.js'
export default {
  //store,
  data(){
    return {
      name: 'Cher joueur',
      launch: false,
      display: false
    }
  },
  methods: {
    nameThisPlayer(name){
      this.name = name

      let currentPlayer = this.$store.state.players.find(p => p.name === this.name)
      if (!currentPlayer) {
        //currentPlayer = new Player(name)
        this.$store.dispatch('addPlayer', name)
      }
      this.launch = true
      this.display = true
    }
  },

  components: {
    Entry,
    Board,
    PlayingZone
  },
};
</script>


<style>

#intro {
    padding: 15px;
    background-color: brown;
    color: white;
    margin: 20px auto;
}
input {
    display: block;
    width: 100%;
    border: solid 1px red;
    margin-bottom: 10px;
}
.center {
  width: 90%;
  margin: 10px auto;
}
</style>
