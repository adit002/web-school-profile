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

export function sortMenusBySequence(menus) {
  return menus
    .map((menu) => {
      if (menu.child_menus && Array.isArray(menu.child_menus)) {
        menu.child_menus = sortMenusBySequence(menu.child_menus)
      }
      return menu
    })
    .sort((a, b) => a.sequence - b.sequence)
}

export function findDataByName(menus, targetName, type) {
  if (!Array.isArray(menus)) return null

  for (const menu of menus) {
    if (menu.name?.toLowerCase() === targetName.toLowerCase()) {
      return menu[type]
    }

    if (Array.isArray(menu.child_menus) && menu.child_menus.length > 0) {
      const found = findDataByName(menu.child_menus, targetName, type)
      if (found) return found
    }
  }

  return null
}

export function filterMenus(menus, dummy, from = '') {
  return menus
    .map((menu) => {
      const filteredChildren = menu.child_menus ? filterMenus(menu.child_menus, dummy, from) : []

      const isMatching = menu.is_parent === 'N' && menu.groupDetail?.is_read === 'Y'

      if (isMatching || filteredChildren.length > 0) {
        const icon = findDataByName(dummy, menu.name, 'icon')
        const url = findDataByName(dummy, menu.name, 'url')
        menu.icon = icon || ''
        menu.url = url || '#'
        return { ...menu, child_menus: filteredChildren }
      }

      return null
    })
    .filter(Boolean)
}

export function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter((item) => item !== undefined)
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const cleanedValue = cleanObject(value)
      if (
        cleanedValue !== null &&
        cleanedValue !== '' &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
        !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)
      ) {
        acc[key] = cleanedValue
      }
      return acc
    }, {})
  }
  return obj
}

export function findMenuItem(menuList, targetName) {
  for (const menu of menuList) {
    if (menu.name.toLowerCase() == targetName.toLowerCase()) {
      return true
    }

    if (menu.child_menus && menu.child_menus.length > 0) {
      if (findMenuItem(menu.child_menus, targetName)) {
        return true
      }
    }
  }
  return false
}

function detectFileType(base64) {
  const binary = atob(base64)
  const bytes = binary
    .slice(0, 4)
    .split('')
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join(' ')

  const signatures = {
    '25 50 44 46': 'pdf',
    '89 50 4e 47': 'png',
    'ff d8 ff e0': 'jpg',
    'ff d8 ff e1': 'jpg',
    '50 4b 03 04': 'zip',
    '47 49 46 38': 'gif',
  }

  for (const [signature, ext] of Object.entries(signatures)) {
    if (bytes.startsWith(signature)) return ext
  }

  return 'bin'
}

export function downloadBase64File(base64, filename = 'file') {
  const ext = detectFileType(base64)
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray])
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export function formatCurrencyWithoutSymbol(amount, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    // minimumFractionDigits: 2,
    // maximumFractionDigits: 2,
  }).format(amount)
}

export function getFormattedNumber(num, length = 4) {
  return String(num).padStart(length, '0')
}

export function formatDateToDDMMYYYY(date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${year}-${month}-${day}`
}

export function allValuesSameByKey(list, path) {
  const keys = path.split('.')
  return list.every(
    (item, _, [first]) =>
      keys.reduce((acc, key) => acc?.[key], item) === keys.reduce((acc, key) => acc?.[key], first),
  )
}

export function calculateDiscountedPrice(price, { percent = 0, value = 0 }) {
  let discount = 0

  if (value) {
    discount = value
  } else if (percent) {
    discount = (price * percent) / 100
  }

  const finalPrice = price - discount
  return parseFloat(finalPrice.toFixed())
}

export function calculateTax(price, taxRate) {
  const tax = (price * taxRate) / 100
  const total = price + tax
  return {
    tax: parseFloat(tax.toFixed()),
    total: parseFloat(total.toFixed()),
  }
}
