<template>
    <div>
        <div class="hand-board">
            <ul v-if="keepPlaying" class="flex-list">
                <li v-for="domino in playerHand" :key="domino.id" class="game-item">
                  <half-domino :value="domino.value[0]" v-on:chosen="playerPlays(domino, 'left')"></half-domino>
                  <half-domino :value="domino.value[1]" v-on:chosen="playerPlays(domino, 'right')"></half-domino>
                </li>
            </ul>
            <div v-if="wrong">
                <p style="color: white; font-size: 24px;"><strong>{{ errorMessage }}</strong></p>
            </div>
            <div v-if="progression">
                <!--<progression-circle :playerScore= "playerScore" :machineScore= "machineScore"></progression-circle>-->
                <p style="color: white; font-size: 24px;"><strong>{{ resultMessage }}</strong></p>
            </div>
            <p class="explanation" v-else>{{ intro }}</p>
        </div>
      <div v-if="display" class="commands">
            <button v-if="start" class="btn-play" ref="start" @click="startGame">{{ name }}, lancez le jeu</button>
            <transition name="fade" mode="in-out"><button v-if="draw" class="btn-play" style="background-color: brown;" ref="draw" @click="drawAgain(1)">Piochez</button></transition>
            <transition name="end"><button v-if="stopDrawing" class="btn-play" style="background-color: yellow; color: black;" ref="pass" @click="pass=!pass">Passez</button></transition>
        </div>
        <services></services>

    </div>
</template>

<script>
import { Store } from '../store/index'
import HalfDomino from './HalfDomino.vue'
import Services from './Services.vue'
import calculations from '../services/calculations.js'
import _ from 'lodash'
//import ProgressionCircle from './ProgressionCircle.vue'

export default {
    props: {
        name: String,
        launch: Boolean,
        display: Boolean
    },
    //store,
    components: {
        HalfDomino,
        Services,
        //ProgressionCircle
    },
    data(){
        return {
            intro: `Cliquez sur le domino de votre choix; il se placera automatiquement sur le tapis.
              Un clic sur le haut l\'envoie à gauche, un clic sur le bas l\'envoie à droite.`,
            errorMessage: this.name + ', vous ne pouvez pas jouer ce domino. Peut-être devez-vous piocher...',
            resultMessage: '',
            uptoMachine: false,
            uptoPlayer: true,
            tour: 0,
            start: true,
            playerChoices: [],
            machineChoices: [],
            keepPlaying: true,
            draw: false,
            stopDrawing: false,
            empty: false,
            lock: [],
            pass: false,
            double: false,
            wrong: false,
            winner: 0,
            progression: false,

        }
    },
    computed: {
        playerHand(){
            return this.$store.state.player.hand
        },
        machineHand(){
            return this.$store.state.machine.hand
        },
        board(){
            return this.$store.state.board
        },
        head(){
            if (this.tour < 2) return
            else return calculations.calculateHead(this.$store.state.board)
        },
        tail(){
            if (this.tour < 2) return
            else return calculations.calculateTail(this.$store.state.board)
        },
        restPieces(){
            return this.$store.state.shuffledPieces.length
        }
    },
    watch: {
       uptoMachine(){
            var self = this
            setTimeout(() => { self.machinePlays() }, 1000)
        }, 
        uptoPlayer(){
            if (this.tour > 1){
                
                this.playerChoices = this.playerHand.filter( d => d.value[0] === this.head || d.value[0] === this.tail || d.value[1] === this.head || d.value[1] === this.tail )
                console.log('PLAYER CHOICES', this.playerChoices)

                if (this.playerChoices.length === 0) {
                    if ( this.$store.state.shuffledPieces.length === 0 ) {
                        this.stopDrawing = true
                    } else {
                        this.draw = true
                    }
                }
            }
        },
        // main du joueur
        playerHand(){
            if (this.playerHand.length < 1) {
                this.keepPlaying = false
                this.winner = 1
                this.claimVictory()
                //this.start = true

            }
        },
        playerChoices(){
            if (this.playerChoices < 1){
                if (this.$store.state.shuffledPieces.length === 0) {
                    this.stopDrawing = true
                }
                this.draw = true
            }
        },
        // quand le joueur est coincé... mémorise les valeurs qu'il n'a pas dans son jeu
        empty(){
            if (this.empty === true){
                let lastRight = this.$store.state.board.length - 1
                this.lock.push(this.$store.state.board[0].value[0])
                this.lock.push(this.$store.state.board[lastRight].value[1])
                console.log('COINCE AVEC...', this.lock)
                this.$store.dispatch('addToLock', this.lock)
            }
        },
        // main de la machine
        machineHand(){
            if (this.machineHand.length < 1) {
                this.keepPlaying = false
                this.winner = 2
                this.claimVictory()
                //this.start = true
            }
        },
        // plus de pioche... et plus de choix pour la machine
        restPieces(){
            if (this.restPieces < 1){
                this.draw = false
                this.stopDrawing = true
                if (this.machineChoices.length === 0) {
                    this.keepPlaying = false
                    this.winner = 1
                    this.claimVictory()
                    //this.start = true
                }
            }
        },
        // quand on arrive à une situation bloquée
        pass(){
            if (this.machineChoices.length === 0 && this.playerChoices.length === 0) {
                this.keepPlaying = false
                this.winner = 0
                this.claimVictory()
                //this.start = true
            }
        }
    },
        
        

    methods: {
        startGame: function(){
            if (this.$store.state.board.length > 0) {
                this.$store.dispatch('clearAll')
                this.resetAll()
            }
            this.$store.dispatch('shufflePieces')
            let click = 0
            while (click < 6){
            this.$store.dispatch('fullHand')
            click++
            }
            this.start = false
            this.tour = 1
            return this.$store.state.player.hand
        },
        
        whoBegins: function(){
            if (this.tour = 0) {
                let machineMax = 0
                
    // y a t il des doubles => filtrer le tableau et prendre le double le plus haut
    //si pas de double, prendre le "total" le plus élevé
    
    
    for (let dom of this.machineHand) {
        dom.total = dom.value[0] + dom.value[1]
        dom.double = dom.value[0] == dom.value[1] ? true : false
    }
    let doublesM = this.machineHand.filter(d => d.double)
    doublesM.sort( (a,b) => b.total - a.total)
    let machineFirst = doublesM.length ? doublesM[0] : this.machineHand.sort ( (a,b) => b.total - a.total)[0]
    console.log('TOP', machineFirst)

    for (let dom of this.playerHand) {
        dom.total = dom.value[0] + dom.value[1]
        dom.double = dom.value[0] == dom.value[1] ? true : false
    }

    let doublesP = this.playerHand.filter(d => d.double)
    doublesP.sort( (a,b) => b.total - a.total)
    let playerFirst = doublesP.length ? doublesP[0] : this.playerHand.sort ( (a,b) => b.total - a.total)[0]
      console.log('TOP', playerFirst)

      if (doublesM.length && doublesP.length) {
          let whoBegins = machineFirst.value[0] + machineFirst.value[1] > playerFirst.value[0] + playerFirst.value[1] ? machineFirst : playerFirst
          console.log('WHO BEGINS', whoBegins)

      }
      if (doublesM.length && !doublesP.length) {
          let whoBegins = machineFirst
          console.log('WHO BEGINS', whoBegins)

      }
      if (!doublesM.length && doublesP.length) {
        let whoBegins = playerFirst
        console.log('WHO BEGINS', whoBegins)

        }
    if (!doublesM.length && !doublesP.length) {
        let whoBegins = machineFirst.value[0] + machineFirst.value[1] > playerFirst.value[0] + playerFirst.value[1] ? machineFirst : playerFirst
        console.log('WHO BEGINS', whoBegins)
    }


            else {
                if (this.playerWins) {
                }
                else {
                }
            }

        playerPlays(domino, side){
            console.log('BEFORE CALCUL', this.$store.state.board)
            if (this.tour === 1) {
                let head = domino.value[0]
                let tail = domino.value[1]

                console.log('PREMIER TOUR', domino, head, tail)
            } else {
                
                    // empêche la mise par le joueur sur le tapis de jeu d'un domino inadéquat
                /*console.log('GOOD DOMINO?', this.playerChoices, domino)
                if (!this.playerChoices.includes(domino)) {
                    console.log('WRONG DOMINO!')
                    this.wrong = true
                    } */
            }   
            domino.player = true
            calculations.positionningTheChosenDomino(domino, this.head, this.tail, side)

            console.log('MON DOMINO', domino)
            this.$store.dispatch('addToBoard', domino)
            let score = { player: true, score: calculations.updateScores(this.$store.state.player.hand) }
            this.tour = ++this.tour
            this.uptoMachine = !this.uptoMachine
        },
                
        // c'est la machine qui joue
        machinePlays(){
            if (this.keepPlaying === true) {
                if (this.$store.state.board.length > 0){
                    // détermination des choix possibles pour la machine
                    let choices = []
                    
                    console.log('HEAD AND TAIL', this.head, this.tail)

                    let one = this.$store.state.machine.hand.filter(d => d.value[0] === this.head)
                    if (one) choices.push(one)

                    let two = this.$store.state.machine.hand.filter(d => d.value[1] === this.head)
                    if (two) choices.push(two)

                    let three = this.$store.state.machine.hand.filter(d => d.value[0] === this.tail)
                    if (three) choices.push(three)

                    let four = this.$store.state.machine.hand.filter(d => d.value[1] === this.tail)
                    if (four) choices.push(four)
                    console.log('FIRST CHOICES', choices)
                    let allChoices = _.flatten(choices)
                    allChoices = new Set(allChoices)
                    this.machineChoices = [ ...allChoices ]
                    let choicesNum = this.machineChoices.length
                    
                    console.log('MACHINECHOICES', this.machineChoices)
                    this.$store.dispatch('actualizeMachineChoices', choicesNum)

                    // selon les résultats... pas de choix, un seul choix, plusieurs choix possibles
                    // pas de domino à placer : la machine pioche...
                    if (this.machineChoices.length === 0) {
                        if (this.$store.state.machine.noChoice === true){
                            this.keepPlaying = false
                        } else {
                            let continueDrawing = true
                            while (continueDrawing && this.$store.state.shuffledPieces.length > 0) {
                                this.drawAgain(0)

                                let last = this.$store.state.machine.hand[this.$store.state.machine.hand.length-1]
                                console.log('LAST', last)
                                if (last.value[0] === this.head || last.value[1] === this.head || last.value[0] === this.tail || last.value[1] === this.tail){
                                    last.player = false
                                    this.machineChoices.push(last)
                                    continueDrawing = false

                                    console.log('MACHINECHOICES AFTER DRAWING', this.machineChoices)
                                }
                                else this.drawAgain(0)
                            }
                            if (this.$store.state.shuffledPieces.length === 0) {
                                let continueDrawing = false
                                this.$store.machine.noChoice = true
                                this.uptoPlayer = !this.uptoPlayer
                            }
                        }
                    }
                    //la machine a un ou plusieurs dominos possibles : comment choisir le meilleur ?
                    if (this.machineChoices.length > 0) {
                        let final = calculations.calculateBestChoice(this.machineChoices, this.lock)
                        console.log('FINAL', final)
                        let piece = this.$store.state.machine.hand.find(p => p.value[0] === final[0] && p.value[1] === final[1])
                        console.log("PIECE TO PLAY", piece, this.head, this.tail)
                        piece.player = false
                        calculations.positionningTheChosenDomino(piece, this.head, this.tail)
                
                        this.$store.dispatch('addToBoard', piece)
                        let score = { player: false, score: calculations.updateScores(this.$store.state.machine.hand) }
                        this.$store.dispatch('updateScore', score)
                        this.uptoPlayer = !this.uptoPlayer
                        } 


                }
            }
        },
        
        // pioche (illimitée, jusqu'à trouver le bon domino, ou à vider la réserve)
        drawAgain(player){
            // si lapioche est vide
            if (this.$store.state.shuffledPieces.length === 0) {
                this.stopDrawing = true
                this.draw = false
                this.upto = !upto
            }
            // si c'est le joueur humain qui pioche (bouton 'DRAW')
            if (player === 1) {
                this.empty = true
                this.lock.push(this.$store.state.board[0].value[0], this.$store.state.board[this.$store.state.board.length-1].value[1])
                let newLock = new Set(this.lock)
                this.lock = [ ...newLock ]
                this.$store.dispatch('drawOne', player)
                return this.$store.state.player.hand
            }
            // si c'est la machine qui pioche
            if (player === 0) {
                if (this.stopDrawing === true) {
                    this.$store.dispatch('noMoreChoice')
                    return
                }
            if (this.stopDrawing === false) {
                this.$store.dispatch('drawOne', player)
                return this.$store.state.machine.hand
                    }
            }
        },


        // afficher le résultat de la partie
        claimVictory(){
            let results = { winner: this.winner, player: this.playerHand, machine: this.machineHand }
            let finalTotal = calculations.calculateScores(results)

            if (this.winner === 0) {
                if (finalTotal > 0) this.resultMessage = 'Les deux joueurs sont bloqués, mais la machine gagne par ' + finalTotal + " points."
                if (finalTotal < 0) this.resultMessage = 'les deux joueurs sont bloqués, mais vous, '+ this.name + ', gagnez par ' + Math.abs(finalTotal) + " points."
                if (finalTotal === 0) this.resultMessage = 'Les deux joueurs ne peuvent être départagés.'
            }
            if (this.winner === 1) this.resultMessage = "Bravo "+ this.name + ", vous avez gagné par " + finalTotal + " points !"
            if (this.winner === 2) this.resultMessage = "C'est la machine qui a gagné par "+ finalTotal + " points !"
            this.progression = true
            this.stopDrawing = false
        },
        // remettre le composant ChangeHand à zéro pour une nouvelle partie
        resetAll(){
            this.tour = 0
            this.start = true
            this.keepPlaying = true
            this.draw = true
            this.winner = 0
            this.empty = false
            this.newLock = []
            this.stopDrawing = false
            this.pass = false
        }
    }
}
       


    

</script>

<style>
.hand-board {
    background-color: green;
    border: solid 5px brown;
    width: 100%;
    margin: 10px auto;
    background-color: green;
    padding: 10px;
}
.explanation {
    width: 50%;
    border : solid 1px white;
    border-radius: 3px;
    margin: 20px auto;
    padding: 15px;
    color: white;
    font-size: 18px;
}
.btn-play {
    margin: 10px;
    padding: 1%;
    background-color: green;
    color: white;
    font-size: 2rem;
    font-weight: 800;
    border-radius: 5%;
    border: solid 1px red;
    box-shadow: 2px 5px 5px rgba(0, 0, 0, .3);
}

.flex-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    align-content: center;
}
.active-domino {
    padding: 0;
    cursor: pointer;
}
.game-item {
    display: inline-block;
    padding: 0;
    margin: 15px 5px;
    box-shadow: 1px 1px 1px 1px black;
    cursor: pointer;
    animation: enterTheHand 1s;
}
.commands {
    animation: GetVisible 2s ease;
}
.fade-leave-active {
    transition: opacity 2s ease;
}
.fade-leave-to {
    opacity: 0;
}

.end-enter {
    opacity: 0;
    transform: translateX(30px)
}
.end-enter-active {
    transition: all 3s ease;
}
.end-enter-to {
    opacity: 1;
    transform: translateX(0px)
}
@keyframes enterTheHand {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}



</style>
