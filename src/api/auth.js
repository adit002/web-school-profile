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
