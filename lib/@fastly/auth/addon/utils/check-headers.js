export default function checkHeaders(errorResponse) {
  const { getResponseHeader } = errorResponse
  try {
    const passwordHeader = getResponseHeader('fastly-password')
    const otpHeader = getResponseHeader('fastly-otp')
    if (passwordHeader) {
      return `password:${passwordHeader}`
    } else if (otpHeader) {
      return `otp:${otpHeader}`
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
