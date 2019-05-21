<template>
 <div>
   <h1>Type It</h1>
  <input type="button" class="btn btn-danger room-elem" @click="leaveGame" value="Leave"></input>
   <div id="game-status" v-if="words.length > 0">
    <div class="correct" v-if="winner">Game Over... Winner is <b>{{winner}}</b></div>
    <div id="players-status" v-if="players" v-for="player in Object.keys(players)">
      <b>{{players[player].id}}</b>
      <b-progress :value="players[player].correctCount + players[player].incorrectCount" class="mt-2" :max="words.length" show-progress animated>
        <b-progress-bar :value="players[player].correctCount" variant="success" />
        <b-progress-bar :value="players[player].incorrectCount" variant="danger" />
      </b-progress>
      <br/>
      Correct => <b>{{players[player].correctCount}}</b>
      Incorrect => <b>{{players[player].incorrectCount}}</b>
      Time => <b v-if="players[player] && (players[player].timeEnd == 0)">{{time}}</b><b v-if="players[player] && !(players[player].timeEnd == 0)">{{players[player].timeEnd}}</b>
      WPS => <b v-if="players[player] && (players[player].timeEnd == 0)">{{ Math.floor((((players[player].correctCount + players[player].incorrectCount) / time)) * 100) / 100 }}</b>
      <b v-if="players[player] && !(players[player].timeEnd == 0)">{{ Math.floor((((players[player].correctCount + players[player].incorrectCount) / players[player].timeEnd)) * 100) / 100 }}</b>
    </div>
    Current Word => <b>{{words[currentIndex]}}</b>
   </div>
    <br/>
    <div id="status-container">
      <div v-for="state in gamestate">
        <div v-bind:class="{ 'correct': state.correct && state.touched,
        'incorrect': !state.correct && state.touched,
        'current': state.current }">
        &nbsp;{{state.word}}</div>
      </div>
    </div>
    <br/>
    <input v-on:keyup.space="isWordCorrect" v-model="typed" v-if="players[username] && players[username].timeEnd == 0"/>
    <Chat v-bind:roomId="roomId"/>
 </div>
</template>

<script>
import TypeIt from '@/services/TypeIt'
import Chat from './Chat'
import Authentication from '@/services/Authentication'

export default {
  data () {
    return {
      socket: this.$store.getters.getIo,
      username: this.$store.getters.getCurrentUser,
      roon:{},
      players: {},
      words: [],
      gamestate: [],
      winner: null,
      currentIndex: 0,
      typed: '',
      time: 0,
      error: ''
    }
  },
  props:{
    roomId: String
  },
  methods: {
    leaveGame(){
      this.socket.emit('leaveRoom', {user: this.username, room: this.roomId});
    },
    isWordCorrect(){
      console.log(this.words)
      if(this.typed.slice(0, -1) === this.words[this.currentIndex]){
        this.players[this.username].correctCount++;
        this.gamestate[this.currentIndex].touched = true
        this.gamestate[this.currentIndex].correct = true
        this.gamestate[this.currentIndex].current = false
      }
      else{
        this.players[this.username].incorrectCount++;
        this.gamestate[this.currentIndex].touched = true
        this.gamestate[this.currentIndex].current = false
      }
      let player = this.username;
      this.socket.emit('gameUpdate', {player: 
        { id: this.username,
          timeEnd: 0,
          correctCount: this.players[player].correctCount,
          incorrectCount: this.players[player].incorrectCount},
          room: this.roomId
        });
      this.currentIndex++;
      this.typed = '';
      if(this.currentIndex >= this.words.length){
        this.gameOver();
      }
      else{
        this.gamestate[this.currentIndex].current = true;
      }
    },
    gameOver(){
    this.socket.emit('gameUpdate', {player: 
        { id: this.username,
          timeEnd: this.time,
          correctCount: this.players[this.username].correctCount,
          incorrectCount: this.players[this.username].incorrectCount},
          room: this.roomId
        });
    }
  },
  components: {
    Chat
  },
  mounted() {
    this.socket.on('gameUpdate', (data) => {
        console.log(data)
        this.words = data.words;
        this.time = data.time;
        this.players = data.players;

        if(this.gamestate.length == 0){
          for(let word in this.words){
            this.gamestate.push({'correct':false, 'touched':false, 'current':false, 'word':this.words[word]});
          }
          this.gamestate[0].current = true;
        }
    });
    this.socket.on('leftRoom', () => {
        this.$router.push({ name: 'game' });
    });
    this.socket.on('gameOver', (winner) => {
        this.winner = winner;
    });
    Authentication.isAuthenticated({
      user: this.$store.getters.getCurrentUser,
      token: this.$store.getters.getAuthToken
    })
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      this.$router.push({ name: 'home' })
      console.log(err)
    })
  }
}
</script>

<style scoped>
#status-container{
  display: inline-flex;
  flex-wrap: wrap;
  max-width: 500px;

}
.correct {
  color: green;
}
.incorrect {
  color: red;
}
.current {
  font-weight: bold;
  font-size: 120%;
}
.progress {
  max-width: 700px;
  margin: auto;
}
</style>
