<template>
    <div class="half-domino" @click="choose">
        <div class="img-container">
            <img class="domino-value" v-if="value === 0" src="../assets/0.png">
            <img class="domino-value" v-if="value === 1" src="../assets/1.png">
            <img class="domino-value" v-if="value === 2" src="../assets/2.png">
            <img class="domino-value" v-if="value === 3" src="../assets/3.png">
            <img class="domino-value" v-if="value === 4" src="../assets/4.png">
            <img class="domino-value" v-if="value === 5" src="../assets/5.png">
            <img class="domino-value" v-if="value === 6" src="../assets/6.png">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: Number
    },
    methods: {
        choose(){
            this.$emit('chosen')
        }
    }
}
</script>

<style scoped>
.half-domino {
    width: 80px;
    height: 80px;
    border-radius: 5px;
    border: solid 2px black;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}
.row-in-domino {
    height: 24px;
    padding: 2px;
}
.surdot {
    display: inline-block;
    width: 30%;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: black;
    margin: 0 auto;
}

.img-container {
    padding: 0;
}
.domino-value {
    width: 100%;
}
</style>
