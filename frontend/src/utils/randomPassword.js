export const template = [
  '0123456789',
  'abcdefghijklmnopqrstuvwxyz',
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  '!@#$^*-_=',
]

const randomPassword = (digits = 8) => {
  const pwd = new Array(digits)
    .fill(1)
    .map((_, i) => {
      const temp = i < 4 ? template[i] : template[Math.floor(Math.random() * 4)]
      const tempArr = temp.split('')
      return tempArr[Math.floor(Math.random() * tempArr.length)]
    })
    
  pwd.sort(() => Math.floor(Math.random() * 2) === 1 ? 1 : -1)

  return pwd.join('')
}

export default randomPassword