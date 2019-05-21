import Api from '@/services/Api'

export default {
  makeRandomSentences () {
    return Api().get('https://geek-jokes.sameerkumar.website/api')
  }
}