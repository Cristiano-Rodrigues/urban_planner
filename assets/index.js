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
    const dragHeight = upEvt.clientY - downEvt.clientY
    
    if (dragHeight <= 0) return
    
    const task = new Task(downEvt, upEvt)
    
    render.drawTask(task)
      .addEventListener('mousedown', task.handleMouseDown)
    storage.add(task)
    
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mouseup', handleMouseUp)
}