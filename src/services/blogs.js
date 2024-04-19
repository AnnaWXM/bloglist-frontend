import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${ baseUrl }/${id}`, newObject)
  return request.then(response => response.data)
}

const like = async (id) => {
  const response = await axios.patch(`${baseUrl}/${id}`)

  return response.data
}

const remove = async (id) => {
  console.log(id)
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

export default { getAll, create, update,like,remove, setToken }