<template>
  <div>
    <div class="input-form" v-if="status === 'login'">
      <b-input-group  prepend="Username" class="mt-3">
        <b-form-input type="text" name="username" v-model="username" />
      </b-input-group>
      <b-input-group  prepend="Password" class="mt-3">
        <b-form-input type="password" name="password" v-model="password" />
      </b-input-group>
      <br>
      <b-button @click="login" variant="primary">Login</b-button>
      <b-button @click="signUp" variant="primary">Sign Up</b-button>
      <br>
      <div v-html="error"></div>
    </div>
    <div class="input-form" v-if="status === 'register'">
      <b-input-group  prepend="Username" class="mt-3">
        <b-form-input type="text" name="username" v-model="username" />
      </b-input-group>
      <b-input-group  prepend="Password" class="mt-3">
        <b-form-input type="password" name="password" v-model="password" />
      </b-input-group>
      <b-input-group  prepend="Name" class="mt-3">
        <b-form-input type="text" name="name" v-model="name" />
      </b-input-group>
      <br>
      <b-button @click="register" variant="primary">Register</b-button>
      <b-button @click="home" variant="danger">Back</b-button>
      <div v-html="error"></div>
    </div>
  </div>
</template>

<script>
import Authentication from '@/services/Authentication'

export default {
  data () {
    return {
      username: '',
      password: '',
      name: '',
      status: 'login',
      error: ''
    }
  },
  components: {
     VFacebookLogin
  },
  methods: {
    login () {
      Authentication.login({
          username: this.username,
          password: this.password
        })
        .then((res) => {
            this.$store.dispatch('setLoginState', {
              username: res.data.user.username,
              token: res.data.token,
              friendList: res.data.user.friendList,
              pendingList: res.data.user.pendingList
            })
            this.$router.push({ name: 'game' })
        })
        .catch((err) => {
            this.error = err.response.data
            console.log(err.response.data)
        })
    },
    register () {
      Authentication.register({
        username: this.username,
        password: this.password,
        name: this.name
      })
      .then((res) => {
        this.status = 'login'
        this.error = ''
      })
      .catch((err) => {
        (err.response.data.error) ? this.error = err.response.data.error : this.error = err.response.data
        console.log(err)
      })
    },
    signUp () {
      this.status = 'register'
      this.error = ''
    },
    home () {
      this.status = 'login'
      this.error = ''
      this.name = ''
    }
  }
}
</script>

<style scoped>
.input-form {
  display: block;
  max-width: 300px;
  margin: auto;
}
</style>
