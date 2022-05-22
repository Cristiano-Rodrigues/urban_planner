function createActivityManager(dispatcher) {
  const status = { activities: {} }
  const storagePlacement = 'urban_status'

  dispatcher.addListener('start', () => {
    status.activities = JSON.parse(localStorage.getItem(storagePlacement))
  })

  dispatcher.addListener('new activity', activity => {
    add(activity)
    store()
  })

  function getAll() {
    return status.activities
  }

  function add(activity) {
    const randomId = getRandomId()
    status.activities[randomId] = activity
    activity.id = randomId
    activity.date = Date.now()
    return activity
  }

  function remove(id) {
    return delete status.activities[id]
  }

  function find(id) {
    return status.activities[id]
  }

  function store() {
    localStorage.setItem(storagePlacement, JSON.stringify(status.activities))
  }

  function getRandomId() {
    const randomId = (Date.now() * Math.random()).toString(32)
    return randomId
  }

  return {
    getAll,
    add,
    remove,
    find,
    store
  }
}