<template>
    <div class="list-view">
      <div>
        <b-card no-body>
          <b-tabs pills card>
            <b-tab title="Friends Online" active>
              <ul>
                <li v-for="friend in friendsOnline">
                  <div>
                    {{ friend }}
                    <b-button variant="danger" v-on:click="deleteFriend(friend)">Delete</b-button>
                  </div>
                </li>
              </ul>
            </b-tab>
            <b-tab title="Friend Offline">
              <ul>
                <li v-for="friend in friendsOffline">
                  <div>
                    {{ friend }}
                    <b-button variant="danger" v-on:click="deleteFriend(friend)">Delete</b-button>
                  </div>
                </li>
              </ul>
            </b-tab>
            <b-tab title="Friend Request">
              <ul>
                <li v-for="invite in pending">
                  <div >
                    {{ invite }}
                    <b-button variant="success" v-on:click="acceptFriend(invite)">Accept</b-button>
                    <b-button variant="danger" v-on:click="rejectFriend(invite)">Reject</b-button>
                  </div>
                </li>
              </ul>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
      <form v-on:submit.prevent="addFriend">
            <label>Add a Friend:</label>
            <input type="text" v-model="friendName">
            <input type="submit" class="submit">
            <div v-html="error"></div>
      </form>
    </div>
</template>

<script>
import FriendApi from "../services/Friend"

export default {
  data () {
      return {
        user: this.$store.getters.getCurrentUser,
        friendName: '',
        friends: this.$store.getters.getFriendList,
        pending: this.$store.getters.getPendingList,
        socket: this.$store.getters.getIo,
        friendsOnline: [],
        friendsOffline: this.$store.getters.getFriendList,
        error: ''
      }
  },
  mounted() {
    this.socket.on('friendOnline', (data) => {
      const friendList = this.$store.getters.getFriendList
      if (friendList.includes(data.name) && !this.friendsOnline.includes(data.name)) {
        this.friendsOnline.push(data.name)
        this.friendsOffline.splice(this.friendsOffline.indexOf(data.name), 1)
        this.socket.emit('onlineResponse', {
          name: this.user
        })
      }
    });
    this.socket.on('onlineResponse', (data) => {
      const friendList = this.$store.getters.getFriendList
      if (friendList.includes(data.name) && !this.friendsOnline.includes(data.name)) { 
        this.friendsOnline.push(data.name)
        this.friendsOffline.splice(this.friendsOffline.indexOf(data.name), 1)
      }
    });
    this.socket.on('friendOffline', (data) => {
      if (this.friendsOnline.includes(data)) { 
        this.friendsOnline.splice(this.friendsOnline.indexOf(data), 1)
        this.friendsOffline.push(data)
      }
    });
    this.socket.on('addToPendingList', (data) => {
      if (this.user == data.receiver && !this.pending.includes(data.sender)) {
        this.pending.push(data.sender)
      }
    });
    this.socket.on('deleteOnlineFriend', (data) => {
      if (this.user == data.receiver) {
        this.friendsOnline.splice(this.friendsOnline.indexOf(data.sender), 1)
      }
    })
    this.socket.on('checkOnline', (data) => {
      if (data.friend == this.user) {
        this.friendsOnline.push(data.name)
        this.socket.emit('sendName', {
          name: this.user,
          socketId: data.socketId
        })
      }
    })
    this.socket.on('currentOnline', (data) => {
      console.log("Original")
      this.friendsOnline.push(data.name)
      this.friendsOffline.splice(this.friendsOffline.indexOf(data.name), 1)
    })
  },
  methods: {
    addFriend() {
      FriendApi.addFriend({
          user: this.user,
          friend: this.friendName
      })
      .then((res) => {
        this.socket.emit('addToPendingList', {
          sender: this.user,
          receiver: res.data.username
        })
      })
      .catch((err) => {
        this.error = err.response.data
        console.log(err)
      })
    },
    deleteFriend(friend) {
      FriendApi.deleteFriend({
        user: this.user,
        friend: friend
      })
      .then((res) => {
        this.$store.dispatch('updateFriendList', {
          friendList: res.data.friendList,
          pendingList: res.data.pendingList
        })
        if (this.friendsOffline.includes(friend)) {
          this.friendsOffline.splice(this.friendsOnline.indexOf(friend), 1)
        } else {
          this.friendsOnline.splice(this.friendsOnline.indexOf(friend), 1)
          this.socket.emit('deleteOnlineFriend', {
            sender: this.user,
            receiver: friend
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
    },
    acceptFriend(friend) {
      FriendApi.acceptFriend({
        user: this.user,
        friend: friend
      })
      .then((res) => {
        console.log(res)
        this.$store.dispatch('updateFriendList', {
          friendList: res.data.friendList,
          pendingList: res.data.pendingList
        })
        this.pending.splice(this.pending.indexOf(friend), 1)
        this.socket.emit('checkOnline', {
          name: this.user,
          friend: friend,
          socketId: this.socket.id
        })
        this.friendsOffline.push(friend)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    rejectFriend(friend) {
      FriendApi.rejectFriend({
        user: this.user,
        friend: friend
      })
      .then((res) => {
        this.$store.dispatch('removePendingList', {
          friend: res.data   
        })
        this.pending.splice(this.pending.indexOf(friend), 1)
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
.list-view {
  max-width: 500px;
}
</style>
