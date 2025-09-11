export const generateVerificationCode = () => {
  const lengthOfString = 8
  let result = ''
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < lengthOfString; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
