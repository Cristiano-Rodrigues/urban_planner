function createActivityManager() {
  const activities = {}

  function add(activity) {
    const randomId = getRandomId()
    activities[randomId] = activity
    activity.id = randomId
    activity.date = Date.now()
    return activity
  }

  function remove(id) {
    return delete activities[id]
  }

  function find(id) {
    return activities[id]
  }

  function store() {
    localStorage.setItem('urban_status', JSON.stringify(activities))
  }

  function getRandomId() {
    const randomId = (Date.now() * Math.random()).toString(32)
    return randomId
  }

  return {
    add,
    remove,
    find,
    store
  }
}