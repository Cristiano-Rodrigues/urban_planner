function start(render, storage) {
  render.drawTable()

  storage.each(render.drawTask)
  addListeners(render, storage)
}

start(render, storage)

function addListeners(render, storage) {
  const cells = document.querySelectorAll('td.time-share')

  cells.forEach(cell => {
    cell.addEventListener('mousedown', downEvt => {
      handleMouseDown(downEvt, render, storage)
    })
  })
}

function handleMouseDown(downEvt, render, storage) {
  downEvt.preventDefault()

  function handleMouseUp(upEvt) {
    document.removeEventListener('mouseup', handleMouseUp)

    const dragHeight = upEvt.clientY - downEvt.clientY
    
    if (dragHeight <= 10) return
    
    const task = new Task(downEvt, upEvt)
    const targetCell = downEvt.target
    
    render.drawTask(task, targetCell)
    storage.add(task)
  }
  
  document.addEventListener('mouseup', handleMouseUp)
}