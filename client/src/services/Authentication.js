import Api from '@/services/Api'

export default {
  register (data) {
    return Api().post('register', data)
  },
  login (data) {
    return Api().post('login', data)
  },
  isAuthenticated (data) {
    return Api().post('isAuthenticated', data)
  }
}
