import Api from '@/services/Api'

export default {
  getWaitingRooms () {
    return Api().get('getWaitingRooms')
  }
}
