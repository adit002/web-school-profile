import apiClient from './apiClient'

export const login = async (credentials) => {
  const response = await apiClient.post('/public/user/login', credentials)
  return response.data
}

export const logout = async () => {
  await apiClient.post('/auth/logout')
}

export const profileAdd = async (credentials) => {
  const response = await apiClient.post('/private/user/profile/add', credentials)
  return response.data
}

export const profileEdit = async (credentials) => {
  const response = await apiClient.post('/private/user/profile/update', credentials)
  return response.data
}

export const profileList = async (credentials) => {
  const response = await apiClient.get('/public/user/list/profile', credentials)
  return response.data
}

export const registereAdd = async (credentials) => {
  const response = await apiClient.post('/public/user/register/add', credentials)
  return response.data
}

export const registerEdit = async (credentials) => {
  const response = await apiClient.post('/private/user/register/update', credentials)
  return response.data
}

export const registerList = async (credentials) => {
  const response = await apiClient.get('/private/user/list/register', credentials)
  return response.data
}

export const newseAdd = async (credentials) => {
  const response = await apiClient.post('/private/user/news/add', credentials)
  return response.data
}

export const newsEdit = async (credentials) => {
  const response = await apiClient.post('/private/user/news/update', credentials)
  return response.data
}

export const newsList = async (credentials) => {
  const response = await apiClient.get('/public/user/list/news', credentials)
  return response.data
}
