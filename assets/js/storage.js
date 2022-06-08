import Task from './task.js'

export default class Storage {
  constructor(tasks) {
    this._place = 'tasks'
    this._tasks = tasks || this.restore()
  }

  each(fn) {
    for (const id in this._tasks) {
      fn.call(null, this._tasks[id])
    }
  }

  add(task) {
    this._tasks[task.id] = task
    this.store()
  }

  remove(id) {
    const task = this._tasks[id]
    delete this._tasks[id]
    this.store()
    return task
  }

  get(id) {
    return this._tasks[id]
  }

  filter(filterFn) {
    const passed = {}
    for (const id in this._tasks) {
      const task = this._tasks[id]
      if ( filterFn(task) ) {
        passed[id] = task
      }
    }
    return new Storage(passed)
  }

  store() {
    localStorage.setItem(this._place, JSON.stringify(this._tasks))
  }

  restore() {
    const rawTasks = JSON.parse(localStorage.getItem(this._place))
    const normalizedTasks = {}
    for (const id in rawTasks) {
      const rawTask = rawTasks[id]
      const task = new Task(rawTask)
      normalizedTasks[id] = task
    }
    return normalizedTasks
  }
  
}