import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Authentication from '@/components/Authentication'
import Waitrooms from '@/components/Waitrooms'
import Room from '@/components/Room'
import TypeIt from '@/components/TypeIt'
import Game from '@/components/Game'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/authentication',
      name: 'authentication',
      component: Authentication
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: Waitrooms
    },
    {
      path: '/room/:roomId',
      name: 'room',
      component: Room,
      props: true
    },
    {
      path: '/typeit/:roomId',
      name: 'typeit',
      component: TypeIt,
      props: true
    }
  ]
})
