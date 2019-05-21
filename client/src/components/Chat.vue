<template>
 <div class="chat">
   <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="chat" id="chat">
            <ul id="msg-list">
              <li v-for="msg in chat"><b>{{msg.username}}:&nbsp;</b>{{msg.message}}</li>
            </ul>
          </div>
          <form id="messageForm" v-on:submit.prevent="sendMessage">
            <div class="form-group">
              <label>Enter Messages:</label>
              <textarea class="form-control" v-model="message" id="message"></textarea>
              <br/>
              <input type="submit" class="btn btn-primary" value="Send Message"/>
            </div>
          </form>
        </div>
      </div>
   </div>
 </div>
</template>

<script>
export default {
    data() {
        return {
            message: '',
            chat: [],
            users: [],
            socket : this.$store.getters.getIo
        }
    },
    props:{
      roomId: String
    },
    methods: {
        sendMessage(e) {
            console.log(this.roomId);
            this.socket.emit('sendMessage', {
                username: this.$store.getters.getCurrentUser,
                message: this.message,
                room: this.roomId
            });
            this.message = '';
        }
    },
    mounted() {
        this.socket.on('receiveMessage', (data) => {
            console.log(data)
            if(data.room == this.roomId){
              this.chat.push(data);
            }
        });
        this.socket.on('playerOnline', (data) => {
            console.log(data)
            this.users = data;
        });
    }
}
</script>

<style scoped>
.chat {
  text-align: left;
}
</style>
