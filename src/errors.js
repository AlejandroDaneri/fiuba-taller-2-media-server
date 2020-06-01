function response (code, message, data = null) {
  return {
    code: code,
    message: message,
    data: data
  }
}

module.exports = {
  response: response
}
