<template>
  <div>
    Logged in as: {{ currentUser }}
    <br/>
    <b>Room Name:</b><div class="room-elem">{{ roomId }}</div>
    <b>Capacity:</b><div v-bind:class="{ 'room-elem correct': length(room.members) < 3,
        'room-elem warn': length(room.members) == 3,
        'room-elem incorrect': length(room.members) == 4}">{{ length(room.members) }}/4</div>
    <b>Status:</b><div v-bind:class="{ 'room-elem correct': room.status == 'Ready',
        'room-elem warn': room.status == 'Waiting',
        'room-elem incorrect': room.status == 'InGame'}">{{ room.status }}</div>
    <input type="button" class="btn btn-danger room-elem" @click="kickPlayer(currentUser)" value="Leave"></input>
    <div id="roomProperties" v-if="currentUser == room.admin">
      Private Room? <input type="checkbox" v-model="room.private" @change="updateRoom" class="room-elem"></input>
      <input type="button" class="btn btn-info room-elem" @click="startGame" v-if="room.status == 'Ready'" value="Start Game"></input>
    </div>
    <div id="room-container"  v-for="member in room.members">
      <div v-bind:id="'room' + room">
        <div class="room-elem warn" v-if="member.id == room.admin">|--ADMIN--|</div>
        <div class="room-elem">User: {{ member.id }}</div>
        <div class="room-elem correct" v-if="member.ready">Ready!</div>
        <input type="button" class="btn btn-success room-elem" @click="setReady" v-if="!member.ready && (member.id == currentUser)" value="Ready!"></input>
        <input type="button" class="btn btn-warning room-elem" @click="makeAdmin(member.id)" v-if="currentUser == room.admin && (member.id != room.admin)" value="Admin"></input>
        <input type="button" class="btn btn-danger room-elem" @click="kickPlayer(member.id)" v-if="currentUser == room.admin && (member.id != room.admin)" value="Kick"></input>
      </div>
    </div>
    <Chat v-bind:roomId="roomId"/>
  </div>
</template>

<script>
import Room from '@/services/Room'
import Chat from './Chat'
import Authentication from '@/services/Authentication'
export default {
  data () {
    return {
      socket: this.$store.getters.getIo,
      room: {},
      currentUser: this.$store.getters.getCurrentUser,
    }
  },
  props:{
    roomId: String
  },
  methods: {
    setReady(){
      let ready = true;
      for(let member in this.room.members){
        if(this.room.members[member].id == this.currentUser){
          this.room.members[member].ready = true;
        }
        ready = ready && this.room.members[member].ready;
      }
      if(this.room.status == 'Waiting' && ready){
        this.room.status = 'Ready';
      }

      this.updateRoom();
    },
    kickPlayer(player){
      if(player == this.room.admin){
        let next = 0;
        let found = false;
        while(next < this.room.members.length && !found){
          if(this.room.members[next].id != this.room.admin){
            this.makeAdmin(this.room.members[next].id);
            found = true;
          }
          else{
            next++;
          }
        }
      }
      this.socket.emit('leaveRoom', {user: player, room: this.roomId});
    },
    makeAdmin(player){
      this.room.admin = player;
      this.updateRoom();
    },
    updateRoom() {
      this.socket.emit('updateRoom', {id: this.currentUser, room: this.roomId, properties: this.room});
    },
    startGame(){
      this.room.status = "InGame";
      this.socket.emit('updateRoom', {id: this.currentUser, room: this.roomId, properties: this.room});
      this.socket.emit('gameStart', {room: this.roomId});
    },
    length(obj){
      if(obj){
        return obj.length;
      }
      else{
        return 0;
      }
    }
  },
  components: {
    Chat
  },
  mounted() {
        this.socket.emit('joinRoom', {id: this.currentUser, room: this.roomId});
    Room.getRoom(this.roomId)
    .then((res) => {
        this.room = res.data;
    })
    .catch((err) => {
        console.log(err)
    });

    this.socket.on('updateRoom', (data) => {
        
        this.room = data;
    });
    this.socket.on('leftRoom', () => {
        this.$router.push({ name: 'game' });
    });
    this.socket.on('gameStart', () => {
        this.$router.push({ name: 'typeit', params: { roomId: this.roomId}});
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
.room-elem{
  display: inline-block;
}
.correct {
  color: green;
}
.warn {
  color: orange;
}
.incorrect {
  color: red;
}
</style>