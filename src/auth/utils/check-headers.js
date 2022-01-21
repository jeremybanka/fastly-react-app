/**
 * NOTE: This is a temporary solution until we can get the @fast/auth library to
 * properly import into a React project.
 */

export default function checkHeaders(errorResponse) {
  const { getResponseHeader } = errorResponse
  try {
    const passwordHeader = getResponseHeader(`fastly-password`)
    const otpHeader = getResponseHeader(`fastly-otp`)
    if (passwordHeader) {
      return `password:${passwordHeader}`
    } else if (otpHeader) {
      return `otp:${otpHeader}`
    }
    return false
  } catch (e) {
    return false
  }
}
