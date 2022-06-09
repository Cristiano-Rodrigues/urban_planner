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

  onClick(evt) {
    evt.preventDefault()

    const convert = (durationAmountInMinutes) => {
      const hours = Math.floor(durationAmountInMinutes / 60)
      const minutes = durationAmountInMinutes % 60
      const stringRepr = `${String(hours).padStart(2, 0)}:${String(minutes).padStart(2, 0)}`

      return stringRepr
    }

    const { elements } = document.getElementById('form')
    elements.id.value = this.id
    elements.name.value = this.name
    elements.duration.value = convert(this.durationInMinutes)
    elements.time.value = convert(this.date.getHours() * 60 + this.date.getMinutes())
    elements.repeatAlways.checked = this.checked
    elements.color.value = this.color
    elements.description.value = this.description
  }

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
    return (Math.floor(Math.random() * 255)).toString(16).padStart(2, 0)
  }
  const color = `#${randomHex()}${randomHex()}${randomHex()}`
  return color
}