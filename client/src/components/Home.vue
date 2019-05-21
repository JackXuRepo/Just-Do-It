<template>
 <div>
   <h1>Just Do It</h1>
   <Authentication v-if="isLoggedIn" />
   <Game v-if="!isLoggedIn"/>
 </div>
</template>

<script>
import Authentication from './Authentication'
import Game from './Game'
export default {
  components: {
    Authentication,
    Game
  },
  methods: {
    isLoggedIn(){
      return this.$store.getters.isLoggedIn
    }
  }
}
</script>

<style scoped>
</style>
