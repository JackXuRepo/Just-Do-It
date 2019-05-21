import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'https://just-do-it-games.herokuapp.com'
  })
}
