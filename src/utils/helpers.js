export function capitalizeFirstWord(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join(''),
      ),
    )
  } catch (error) {
    console.error('Invalid JWT:', error)
    return null
  }
}
