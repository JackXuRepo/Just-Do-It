import Api from '@/services/Api'

export default {
  getRoom (roomId) {
    return Api().get('getRoom/' + roomId)
  }
}
