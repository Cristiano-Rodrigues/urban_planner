function createDispatcher() {
  const events = {}

  function addListener(event, callback) {
    if (events[event] === undefined) {
      events[event] = { listeners: [] }
    }
    events[event].listeners.push(callback)
  }

  function removeListener(event, callback) {
    events[event].listeners = events[event].listeners.filter(listener => {
      return listener.toString() !== callback.toString()
    })
  }

  function once(event, callback) {
    addListener(event, details => {
      callback(details)
      removeListener(event, callback)
    })
  }
  
  function dispatch(event, details) {
    if (events[event] === undefined) {
      return console.error(`This event: ${event} does not exist`)
    }
    events[event].listeners.forEach(listener => {
      listener(details)
    })
  }

  return {
    addListener,
    once,
    removeListener,
    dispatch
  }
}