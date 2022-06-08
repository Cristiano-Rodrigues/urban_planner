import Storage from './storage.js'

export default class Calendar {
  constructor() {
    this.storage = new Storage()
    this.MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    this.WEEKDAYS = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]

    const date = this.date = new Date
    this.year = date.getFullYear()
    this.month = this.MONTHS[ date.getMonth() ]
    this.day = date.getDate()
    this.weekday = this.WEEKDAYS[ date.getDay() ]
    this.week = {
      start: date.getDate() - date.getDay(),
      end: date.getDate() + (6 - date.getDay())
    }
  }

  getMonthlyTasks() {
    return this.storage.filter(t => {
      return t.date.getFullYear() === this.year &&
             t.date.getMonth() === this.date.getMonth() ||
             t.repeatAlways === true
    })
  }
  
  getWeeklyTasks() {
    return this.storage.filter(t => {
      return t.date.getFullYear() === this.year &&
             t.date.getMonth() === this.date.getMonth() &&
             t.date.getDate() >= this.week.start &&
             t.date.getDate() <= this.week.end ||
             t.repeatAlways === true
    })
  }

  getDailyTasks = () => {
    return this.storage.filter(t => {
      return t.date.getFullYear() === this.year &&
             t.date.getMonth() === this.date.getMonth() &&
             t.date.getDate() === this.day ||
             t.repeatAlways === true &&
             t.date.getDay() === this.date.getDay()
    })
  }

  add(task) {
    this.storage.add(task)
  }

  remove(task) {
    return this.storage.remove(task)
  }
}