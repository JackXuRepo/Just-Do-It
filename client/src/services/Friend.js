import Api from '@/services/Api'

export default {
  addFriend (data) {
    return Api().patch('addFriend', data)
  },
  rejectFriend(data) {
    return Api().patch('rejectFriend', data)
  },
  acceptFriend(data) {
    return Api().patch('acceptFriend', data)
  },
  deleteFriend(data) {
    return Api().patch('deleteFriend', data)
  }
}