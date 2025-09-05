const method = "textDocument/didChange"

let throttleInterval = 1000 / 30 // this value gets set in the activate function and is controlled by the config

const setUpdatesPerSecond = (updatesPerSecond) => {
  throttleInterval = Math.floor(1000 / updatesPerSecond) - 6
}

const throttleSendNotification = (client) => {
  let lastCallTime = 0
  let timeoutId = null
  let pendingParams = null

  return (params) => {
    pendingParams = params
    if (timeoutId !== null) {
      return
    }

    const now = Date.now()
    const timeEllapsed = now - lastCallTime

    if (timeEllapsed > throttleInterval) {
      lastCallTime = now
      client.sendNotification(method, params)
      return
    }

    timeoutId = setTimeout(() => {
      lastCallTime = Date.now()
      client.sendNotification(method, pendingParams)
      timeoutId = null
      pendingParams = null
    }, throttleInterval - timeEllapsed)
  }
}

module.exports = { throttleSendNotification, setUpdatesPerSecond }
