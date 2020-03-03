import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import calculations from '../services/calculations.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sortedPieces: [
      { value: [0, 0] },
      { value: [0, 1] },
      { value: [0, 2] },
      { value: [0, 3] },
      { value: [0, 4] },
      { value: [0, 5] },
      { value: [0, 6] },
      { value: [1, 1] },
      { value: [1, 2] },
      { value: [1, 3] },
      { value: [1, 4] },
      { value: [1, 5] },
      { value: [1, 6] },
      { value: [2, 2] },
      { value: [2, 3] },
      { value: [2, 4] },
      { value: [2, 5] },
      { value: [2, 6] },
      { value: [3, 3] },
      { value: [3, 4] },
      { value: [3, 5] },
      { value: [3, 6] },
      { value: [4, 4] },
      { value: [4, 5] },
      { value: [4, 6] },
      { value: [5, 5] },
      { value: [5, 6] },
      { value: [6, 6] }
  ],
  shuffledPieces: [],
  players: [],
  player: {
    hand: [],
    lock: [],
    wrong: false,
    score: 0,

  },
  machine: {
    hand: [],
    score: 0,
    noChoice: false,
    machineChoices: 0,

  },
  turn: {
    tour: 0,
    keepPlaying: true,
    draw: false,
    stopDrawing: false
  },
  game: {
    resultMessage: '',
    winner: 0,

  },
  games: [],

  board: [],
  side:'',

  },
  mutations: {
    // ajouter un joueur non encore enregistré
    ADD_PLAYER(state, name){
      state.players.push(name)
    },
    //mélanger les dominos
    SHUFFLE_PIECES(state){
      state.shuffledPieces =  _.shuffle(state.sortedPieces)
    },
    // distribuer les dominos
    FULL_HAND(state){
        state.player.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        state.machine.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log(state.machine.hand)
    },
    // piocher
    DRAW_ONE(state, player) {
        if (player === 1) state.player.hand.push(state.shuffledPieces[0])
        if (player === 0) state.machine.hand.push(state.shuffledPieces[0])
        state.shuffledPieces.shift()
        console.log('STORE DRAWED!')
    },
    NO_MORE_CHOICE(state){
        state.machine.noChoice = true
    },
    ACTUALIZE_MACHINE_CHOICES(state, choicesNum){
        state.machineChoices = choicesNum
    },
    // jouer un domino
    ADD_TO_BOARD(state, domino){
        console.log('STORE DOMINO', domino)
        if (domino.place === 'left') {
            if (domino.value[1] !== domino.head) {
                calculations.swap(domino.value)
                console.log('SWAP LEFT!')
            }
            state.side = 'left'
            state.board.unshift(domino)
        } if (domino.place === 'right') {
            if (domino.value[0] !== domino.tail){
                calculations.swap(domino.value)
                console.log('SWAP RIGHT!')
            }
            state.side = 'right'
            state.board.push(domino)
        }
        if (domino.player === true) {
            let domo = state.player.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let index = state.player.hand.indexOf(domo)
            console.log('DOMO', domo, index)
            state.player.hand.splice(index, 1)
        }
        else {
            let domoM = state.machine.hand.find(d => (d.value[0] === domino.value[0] && d.value[1] === domino.value[1]) || (d.value[0] === domino.value[1] && d.value[1] === domino.value[0]))
            let indexM = state.machine.hand.indexOf(domoM)
            console.log('DOMO MACHINE', domoM, indexM)
            state.machine.hand.splice(indexM, 1)
        }
    },
    // enregistrer les ajouts au board faits par drag and drop
    SAVE_BOARD(state, pieces) {
        state.board = [ ...pieces ]
    },
    // enregistrer la progression du joueur ou de la machine
    UPDATE_SCORE(state, score){
      if (score.player === true){
        state.player.score += score.score
      }
      else state.machine.score += score.score
    },
    // noter les "trous" dans le jeu du joueur humain
    ADD_TO_LOCK(state, lock) {
        state.player.lock.push(...lock)
        let newSetLock = new Set(state.player.lock)
        state.player.lock = [ ...newSetLock ]
    },
    SET_WINNER(state, winner){
      if (winner === 0) state.playerWins = true
      if (winner === 1) state.machineWins = true
      if (winner === 2) state.neitherWins = true
    },
    // tout remettre à zéro pour une nouvelle partie
    CLEAR_ALL(state){
        state.board = []
        state.player.hand = []
        state.machine.hand = []
        state.shuffledPieces = []
        state.player.lock = []
        state.machine.noChoice = false
        state.machineChoices = 0
        state.side = ''
    },
    // sauvegarder le résultat de la partie
    SET_SCORES(state, scores){
        state.game.playerScore = scores.machineFinalScore
        state.game.machineScore = scores.playerFinalScore
        state.game.winner = scores.winner
        return mutations.SAVE_TO_DB(state)

    },

  },
  actions: {
    addPlayer({ commit }, name){
      commit('ADD_PLAYER', name)
    },
    shufflePieces({ commit }){
        commit('SHUFFLE_PIECES')
    },
    fullHand({ commit }){
        commit('FULL_HAND')
    },
    drawOne({ commit }, player){
        commit('DRAW_ONE', player)
    },
    noMoreChoice({ commit }){
        commit('NO_MORE_CHOICE')
    },
    actualizeMachineChoices({ commit }, choicesNum){
        commit('ACTUALIZE_MACHINE_CHOICES', choicesNum)
    },
    addToBoard({ commit }, domino){
        commit ('ADD_TO_BOARD', domino)
    },
    saveBoard({ commit }, newBoard) {
        /*let pieces = []
        for (let piece of newBoard){
            pieces.push(piece)
        }*/
        let pieces = newBoard.map(p => pieces.push(p))
        commit("SAVE_BOARD", pieces)
    },
    addToLock( { commit }, newLock){
      commit('ADD_TO_LOCK', newLock)
    },
    updateScore({ commit }, score){
      commit('UPDATE_SCORE', score)
    },
    clearAll({ commit }){
        commit('CLEAR_ALL')
    },
    setScores({ commit }, scores){
        commit('SET_SCORES', scores)
    },
    setWinner({ commit }, winner){
      commit('SET_WINNER', winner)
    }
  },
  modules: {
  }
})
