function start(render, storage) {
  render.drawTable()

  storage.each(render.drawTask)
  addListeners()
}

start(render, storage)

function addListeners() {
  const cells = document.querySelectorAll('td.time-share')

  cells.forEach(cell => {
    cell.addEventListener('mousedown', handleMouseDown)
  })
}

function handleMouseDown(event) {
  event.preventDefault()
  const yStart = event.y
  const parent = event.target

  function handleMouseUp(evt) {
    const dragHeight = evt.y - yStart
    
    if (dragHeight <= 0) return
    
    const task = createEmptyTask(parent, dragHeight)
    
    storage.add(task)
    render.drawTask(task, parent).addEventListener('mousedown', e => {
      e.stopPropagation()
    })
    
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mouseup', handleMouseUp)
}

function createEmptyTask(parent, dragHeight) {
  const height = parent.getBoundingClientRect().height
  const minutesPerHour = 60, ratio = height / minutesPerHour
  const durationInMinutes = Math.round(dragHeight / ratio)

  const emptyTask = {
    name: 'No name',
    durationInMinutes,
    date: new Date(), // temp
    color: "#7952B3",
    description: 'no description',
    repeatAlways: false,
    checked: false
  }
  return emptyTask
}