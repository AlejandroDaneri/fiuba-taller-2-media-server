/* istanbul ignore file */
function pad (d) {
  return d < 10 ? '0' + d.toString() : d.toString()
}

const today = new Date()
const date =
  today.getFullYear() +
  '/' +
  pad(today.getMonth() + 1) +
  '/' +
  pad(today.getDate())
const time =
  pad(today.getHours()) +
  ':' +
  pad(today.getMinutes()) +
  ':' +
  pad(today.getSeconds())
const dateTime = date + ' ' + time

module.exports = {
  error: message =>
    console.error('\x1b[31m%s\x1b[0m', dateTime + ' [ERROR] ' + message),
  info: message =>
    console.info('\x1b[36m%s\x1b[0m', dateTime + ' [INFO] ' + message),
  warn: message =>
    console.warn('\x1b[33m%s\x1b[0m', dateTime + ' [WARN] ' + message),
  debug: message =>
    console.debug('\x1b[37m%s\x1b[0m', dateTime + ' [DEBUG] ' + message),
  log: message =>
    console.info('\x1b[36m%s\x1b[0m', dateTime + ' [INFO] ' + message)
}
