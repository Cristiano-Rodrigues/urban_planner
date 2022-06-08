export default class Task {
  constructor(...args) {
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

  setup(downEvt, upEvt) {
    const cell = downEvt.target
    const cellBound = cell.getBoundingClientRect()
    const cellHeight = cellBound.height
    const minutesPerHour = 60
    const ratio = cellHeight / minutesPerHour

    const durationInMinutes = calcDuration(downEvt.clientY, upEvt.clientY, ratio)
    const date = calcDate(downEvt, cellBound, ratio)

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

  stopPropagation(evt) { evt.stopPropagation() }

  onClick(evt) {}

  onDragStart(evt) {
    evt.dataTransfer.setData("taskId", this.id)
  }
}

function calcDuration(yStart, yEnd, ratio) {
  const dragHeight = yEnd - yStart
  const durationInMinutes = Math.round(dragHeight / ratio)
  return durationInMinutes
}

function calcDate(downEvt, cellBound, ratio) {
  const date = new Date(downEvt.target.getAttribute('data-date-string'))
  const minutes = (downEvt.clientY - cellBound.y) / ratio
  date.setMinutes(minutes)

  return date
}

function getRandomId() {
  const randomId = (Date.now() * Math.random()).toString(32)
  return randomId
}

function getRandomColor() {
  const randomHex = () => {
    return (Math.floor(Math.random() * 255)).toString(16)
  }
  const color = `#${randomHex()}${randomHex()}${randomHex()}`
  return color
}