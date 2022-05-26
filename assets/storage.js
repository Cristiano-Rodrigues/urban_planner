function storage() {}

storage._place = 'tasks'
storage._tasks = restore() || {}

storage.each = function (fn) {
  for (const id in this._tasks) {
    fn.call(null, this._tasks[id])
  }
}
storage.add = function (task) {
  const id = getRandomId()
  this._tasks[id] = task
  task.id = id
  task.date = task.date.getTime()
  store()
}
storage.remove = function (id) {
  const task = delete this._tasks[id]
  store()
  return task
}
storage.find = function (id) {
  return this._tasks[id]
}
storage.filter = function (filterFn) {
  const passed = {}
  for (const id in this._tasks) {
    const task = this._tasks[id]
    if (filterFn(task)) {
      passed[id] = task
    }
  }
  return passed
}

function getRandomId() {
  const randomId = (Date.now() * Math.random()).toString(32)
  return randomId
}

function store() {
  localStorage.setItem(storage._place, JSON.stringify(storage._tasks))
}

function restore() {
  const rawTasks = JSON.parse(localStorage.getItem(storage._place))
  const normalizedTasks = {}
  for (const id in rawTasks) {
    const rawTask = rawTasks[id]
    rawTask.date = new Date(rawTask.date)
    normalizedTasks[id] = rawTask
  }
  return normalizedTasks
}