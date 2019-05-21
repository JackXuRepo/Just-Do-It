<template>
  <div>
    Logged in as: {{ currentUser }}
    <br/>
    <form id="createRoomForm" v-on:submit.prevent="joinRoom(roomId)">
      <div class="form-group">
        <label>Room Name:</label>
        <input placeholder="Enter Room Id" v-model="roomId"/>
        <input type="submit" class="btn btn-primary" :disabled="!roomId" value="Create / Join"></input>
        <br/>
      </div>
    </form>
    <div id="rooms-container" v-for="room in Object.keys(rooms)">
      <div v-bind:id="'room' + room" v-if="!rooms[room].private">
        <b>Room Name:</b><div class="room-elem">{{ room }}</div>
        <b>Admin:</b><div class="room-elem"> {{ rooms[room].admin }}</div>
        <b>Capacity:</b> <div v-bind:class="{ 'room-elem correct': rooms[room].members.length < 3,
        'room-elem warn': rooms[room].members.length == 3,
        'room-elem incorrect': rooms[room].members.length == 4}">{{ rooms[room].members.length }}/4</div>
        <b>Status:</b> <div v-bind:class="{ 'room-elem correct': rooms[room].status == 'Ready',
        'room-elem warn': rooms[room].status == 'Waiting',
        'room-elem incorrect': rooms[room].status == 'InGame'}"> {{ rooms[room].status }}</div>
        <input type="button" class="btn btn-primary" @click="joinRoom(room)" :disabled="(rooms[room].members.length >= 4) || (rooms[room].status == 'InGame')" value="Join"></input>
      </div>
    </div>
  </div>
</template>

<script>
import WaitingRooms from '@/services/WaitingRooms'
import Authentication from '@/services/Authentication'
export default {
  data () {
    return {
      socket: this.$store.getters.getIo,
      rooms: {}, 
      roomId: null,
      currentUser: this.$store.getters.getCurrentUser,
    }
  },
  methods: {
    joinRoom(roomId) {
      this.$router.push({ name: 'room', params: { roomId: roomId} })
    }
  },
  beforeMount(){
    WaitingRooms.getWaitingRooms()
    .then((res) => {
        this.rooms = res.data;
    })
    .catch((err) => {
        console.log(err)
    })
  },
  mounted() {
    this.socket.on('waitingRooms', (data) => {
        this.rooms = data;
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