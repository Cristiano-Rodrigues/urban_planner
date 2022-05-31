function Task(...args) {
  if (args.length === 1) {
    const rawTask = args[0]
    Object.assign(this, rawTask, {
      date: new Date(rawTask.date)
    })
  } else if (args.length === 2) {
    const [downEvt, upEvt] = args
    
    this.setup(downEvt, upEvt)
  }
}

Task.prototype.setup = function (downEvt, upEvt) {
  const parent = downEvt.target
  const cellBound = parent.getBoundingClientRect()
  const cellHeight = cellBound.height
  const minutesPerHour = 60, ratio = cellHeight / minutesPerHour
  const dragHeight = upEvt.clientY - downEvt.clientY
  const durationInMinutes = Math.round(dragHeight / ratio)

  const time = JSON.parse(parent.getAttribute('data-cell-time'))
  const minutes = (downEvt.y - cellBound.y) / ratio
  const date = new Date()
  date.setDate(time.weekday)
  date.setHours(time.hours)
  date.setMinutes(minutes)

  Object.assign(this, {
    id: getRandomId(),
    name: 'no name',
    description: '',
    color: getRandomColor(),
    repeatAlways: false,
    checked: false,
    durationInMinutes,
    date
  })
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