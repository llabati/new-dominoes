export default {
    // retourne les dominos pour les faire correspondre à la tête ou à la queue
    swap: function(doubleValue){
        console.log('UTILS SWAP!!!', doubleValue)
        let t = doubleValue[0]
        doubleValue[0] = doubleValue[1]
        doubleValue[1] = t
        console.log('UTILS SWAP', doubleValue)
    },
    // désigne la valeur gauche du domino placé à l'extrémité gauche du tapis de jeu
    calculateHead: function(board){
        return board[0].value[0]
    },
    // désigne la valeur droite du domino placé à l'extrémité droite du tapis
    calculateTail: function(board, tour, domino){
        return board[board.length-1].value[1]
    },
    
    updateScores(array){
        return array.reduce((sum, a) => sum + a.value[0] + a.value[1], 0)
    },
    setScores(rest) {
        return rest.reduce((sum, a) => sum + a.value[0] + a.value[1], 0)
    }, 
    //calculer le score final
    calculateScores(results){
        console.log(results)
        let playerTotal = this.setScores(results.player)
        let machineTotal = this.setScores(results.machine)
        if (results.winner === 0) {
            return playerTotal - machineTotal
        }
        if (results.winner === 1) {
            return machineTotal
        }
        if (results.winner === 2){
            return playerTotal
        }
    },

    makeChoice(machineChoices, head, tail, empty){
        console.log('MACHINE CHOICES INSIDE MAKECHOICE', machineChoices, empty)
        // this.empty = quand le joueur ne dispose manifestement pas de certaines valeurs...
        // ne pas jouer sur ces valeurs est un moyen de bloquer le joueur
        if (empty === true){
            let lockChoices = this.lockPlayer(machineChoices, head, tail, )
            console.log('LOCKCHOICES in MAKECHOICE', lockChoices)
            if (lockChoices.length < machineChoices.length) {
                for (let val of lockChoices){
                    for (let choice of machineChoices){
                        if (choice.value.includes(val)){
                            machineChoices.splice(machineChoices.indexOf(choice), 1)
                        }
                    }
                console.log('MACHINECHOICES AFTER LOCK FILTERING', machineChoices)
                    }
                }
            }
        // calcul du domino le plus élevé en points, dont il faut se débarrasser en premier
        let final = this.calculateBestChoice(machineChoices)
  
    },


    // déterminer les possibilités que la machine a de bloquer le joueur et de le forcer à piocher
    lockPlayer(machineChoices, head, tail){
        console.log('MACHINECHOICES in LOCKPLAYER', machineChoices)
        let lockChoices = []
        let lockHead = machineChoices.filter (d => d.value[0] === head || d.value[1] === head)
        let lockTail = machineChoices.filter (d => d.value[0] === tail || d.value[1] === tail)
        lockChoices = [ ...lockHead, ...lockTail ]
        console.log('LOCKCHOICES', lockChoices)
        return lockChoices
    },

    // détermine le meilleur domino à jouer (nombre de points le plus élevé), parmi les choix possibles
    // favorise le choix des doubles
    calculateBestChoice(machineChoices, lock){
        console.log('MACHINECHOICES ENTERING CALCULEBEST CHOICE', machineChoices)
        
        let computedChoices = machineChoices.map(e => [ e.value[0], e.value[1], e.value[0] + e.value[1] ])
        console.log('COMPUTEDCHOICES', computedChoices)
        
        if (lock.length > 0 && lock.length < computedChoices.length) {
            for (let val of lock){
                    for (let choice of computedChoices){
                        if (choice.value.includes(val)){
                            computedChoices.splice(computedChoices.indexOf(choice), 1)
                        }
                    }
                }
            }


        let finalChoices = (computedChoices.find( e => e[0] === e[1])) ? computedChoices.filter(a => a[0] === a[1]).sort((a,b) => b[2] - a[2]) : computedChoices.sort((a,b) => b[2] - a[2])
        console.log('FINAL CHOICES', finalChoices)

        return finalChoices[0]
    },

    // prépare le bon placement du domino choisi en définissant la "tête" (à gauche) ou la "queue" (à droite)
    positionningTheChosenDomino(piece, head, tail, side){
        if ((piece.value[0] === tail && piece.value[1] === head) || (piece.value[0] === head && piece.value[1] === tail)) {
            if (piece.player === true) piece.place = side  
            else piece.place = "left"
        } else {
        piece.place = (piece.value[0] === head || piece.value[1] === head) ? "left" : "right"
        console.log('DOMINO HAS ITS PLACE', piece.place)
            if (piece.place === "left") {
                piece.tail = undefined
                piece.head = head
            } 
            if (piece.place === "right") {
                piece.head = undefined
                piece.tail = tail
            }
        }
        
        
    },

    
}


