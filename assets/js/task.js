function Task(...args) {
  const _this = {}
  if (args.length === 1) {
    const rawTask = args[0]
    Object.assign(_this, rawTask, {
      date: new Date(rawTask.date)
    })
  } else if (args.length === 2) {
    const [downEvt, upEvt] = args

    setup(downEvt, upEvt)
  }

  function setup(downEvt, upEvt) {
    const cell = downEvt.target
    const cellBound = cell.getBoundingClientRect()
    const cellHeight = cellBound.height
    const minutesPerHour = 60
    const ratio = cellHeight / minutesPerHour

    const durationInMinutes = calcDuration(downEvt.clientY, upEvt.clientY, ratio)
    const date = calcDate(downEvt, cellBound, ratio)

    Object.assign(_this, {
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

  _this.onMouseDown = evt => {
    evt.stopPropagation()
  }

  _this.onClick = taskId => {
    const form = document.getElementById('form')
    form.elements.id.value = taskId
  }

  _this.onDragStart = (evt, taskId) => {
    evt.dataTransfer.setData("taskId", taskId)
  }

  function calcDuration(yStart, yEnd, ratio) {
    const dragHeight = yEnd - yStart
    const durationInMinutes = Math.round(dragHeight / ratio)
    return durationInMinutes
  }

  function calcDate(downEvt, cellBound, ratio) {
    const time = JSON.parse(downEvt.target.getAttribute('data-cell-time'))
    const minutes = (downEvt.clientY - cellBound.y) / ratio
    const date = new Date()
    date.setDate(time.weekday)
    date.setHours(time.hours)
    date.setMinutes(minutes)

    return date
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

  return _this
}