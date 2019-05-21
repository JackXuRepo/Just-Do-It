<template>
  <div>
    Logged in as: {{ currentUser }}
    <br>
    <b-button @click="logout" variant="danger">Logout</b-button>
    <FriendList :currentUser="this.currentUser" />
    <Chat />
    <Waitrooms />
  </div>
</template>

<script>
import Chat from './Chat'
import Waitrooms from './Waitrooms'
import FriendList from './FriendList'
import Authentication from '@/services/Authentication'

export default {
  data () {
    return {
      currentUser: this.$store.getters.getCurrentUser,
      socket: this.$store.getters.getIo
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('setLogoutState')
      this.$router.push({ name: 'home' })
    }
  },
  mounted() {
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
  },
  components: {
    Chat,
    FriendList,
    Waitrooms
  }
}
</script>
