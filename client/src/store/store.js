import Vue from 'vue'
import Vuex from 'vuex'
import io from 'socket.io-client'
import { stat } from 'fs';


Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    authToken: localStorage.getItem('token') || null,
    socket: (localStorage.getItem('user')) ? io('https://just-do-it-games.herokuapp.com/', {
      'sync disconnect on unload': true, query: "username=" + localStorage.getItem('user')}) : null,
    currentUser: localStorage.getItem('user') || null,
    isLoggedIn: (localStorage.getItem('user')) ? true : false,
    friendList: [],
    pendingList: []
  },
  getters: {
    isLoggedIn(state) {
      return state.isLoggedIn
    },
    getCurrentUser(state) {
      return state.currentUser
    },
    getIo(state) {
      return state.socket
    },
    getFriendList(state) {
      return state.friendList
    },
    getPendingList(state) {
      return state.pendingList
    },
    getAuthToken (state) {
      return state.authToken
    }
  },
  mutations: {
    setLoginState(state, data) {
      state.socket = io('https://just-do-it-games.herokuapp.com/', {
      'sync disconnect on unload': true, query: "username=" + data.username})
      state.socket.emit('playerOnline', data.username)
      state.socket.emit('friendOnline', {
        name: data.username
      })
      state.authToken = data.token
      state.currentUser = data.username
      state.isLoggedIn = true
      state.friendList = data.friendList
      state.pendingList = data.pendingList
    },
    setLogoutState(state, data) {
      state.socket.emit('friendOffline', data)
      state.socket.disconnect()
      state.authToken = null
      state.currentUser = ''
      state.isLoggedIn = false
      state.friendList = []
      state.pendingList = []
    },
    removePendingList(state, data) {
      state.pendingList = state.pendingList.filter( (e) => { return e !== data })
    },
    updateFriendList(state, data) {
      state.friendList = data.friendList
      state.pendingList = data.pendingList
    }
  },
  actions: {
    setLoginState(context, credentials) {
      localStorage.setItem('user', credentials.username)
      localStorage.setItem('token', credentials.token)
      context.commit('setLoginState', {
        username: credentials.username,
        token: credentials.token,
        friendList: credentials.friendList,
        pendingList: credentials.pendingList
      })
    },
    setLogoutState(context) {
      let user = localStorage.getItem('user')
      localStorage.setItem('user', null)
      localStorage.setItem('token', null)
      context.commit('setLogoutState', user)
    },
    removePendingList(context, friend) {
      context.commit('removePendingList', {
        friend: friend
      })
    },
    updateFriendList(context, data) {
      context.commit('updateFriendList', {
        friendList: data.friendList,
        pendingList: data.pendingList
      })
    }
  }
})