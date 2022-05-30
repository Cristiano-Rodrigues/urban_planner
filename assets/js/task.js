function Task(...args) {
  if (args.length === 1) {
    const task = args[0]
    Object.assign(this, task, {
      date: new Date(task.date)
    })
  } else if (args.length == 2) {
    const [downEvt, upEvt] = args
    
    this.setup(downEvt, upEvt)
  }
}
Task.prototype.setup = function (downEvt, upEvt) {
  Object.assign(this, {
    id: getRandomId(),
    name: 'no name',
    description: '',
    color: getRandomColor(),
    repeateAlways: false,
    checked: false
  })

  const parent = downEvt.target
  const cellBound = parent.getBoundingClientRect()
  const cellHeight = cellBound.height
  const minutesPerHour = 60, ratio = cellHeight / minutesPerHour
  const dragHeight = upEvt.clientY - downEvt.clientY
  this.durationInMinutes = Math.round(dragHeight / ratio)

  const time = JSON.parse(parent.getAttribute('data-cell-time'))
  const minutes = (downEvt.y - cellBound.y) / ratio
  const date = this.date = new Date()
  date.setDate(time.weekday)
  date.setHours(time.hours)
  date.setMinutes(minutes)
}

Task.prototype.handleMouseDown = function(e) {
  e.stopPropagation()
}

function getRandomId() {
  const randomId = (Date.now() * Math.random()).toString(32)
  return randomId
}

function getRandomColor() {
  const randomTo255 = () => {
    return Math.floor(Math.random() * 255)
  }
  const color = `rgb(${randomTo255()}, ${randomTo255()}, ${randomTo255()})`
  return color
}