function start(render, storage) {
  render.drawTable()

  storage.each(render.drawTask)
  addListeners(render, storage)
}

start(render, storage)

function addListeners(render, storage) {
  const cells = document.querySelectorAll('td.time-share')
  const form = document.getElementById('form')

  handleMouseDown(cells, render, storage)
  handleFormSubmit(form, render, storage)
  handleDragAndDrop(cells, render, storage)
}

function handleMouseDown(cells, render, storage) {
  const onMouseDown = downEvt => {
    downEvt.preventDefault()

    const onMouseUp = upEvt => {
      document.removeEventListener('mouseup', onMouseUp)

      const dragHeight = upEvt.clientY - downEvt.clientY
        
      if (dragHeight <= 10) return
        
      const task = Task(downEvt, upEvt)
      const targetCell = downEvt.target
        
      render.drawTask(task, targetCell)
      storage.add(task)
    }
      
    document.addEventListener('mouseup', onMouseUp)
  }

  cells.forEach(cell => {
    cell.addEventListener('mousedown', onMouseDown)
  })
}

function handleFormSubmit(form, render, storage) {
  const onSubmit = event => {
    event.preventDefault()

    const convert = string => {
      const regexp = /^(\d{1,2}):(\d{1,2})$/
      const match = string.match(regexp)
      const [, hours, minutes] = match
      const durationInMinutes = parseInt(hours) * 60 + parseInt(minutes)
  
      return durationInMinutes
    }

    const getFormData = form => {
      const formData = new FormData(form)
      const data = {}
      for (const [name, value] of formData) data[name] = value
      return data
    }

    const taskId = form.elements.id.value
    const oldTask = storage.remove(taskId)
    const oldTaskEl = document.getElementById(oldTask.id)
    oldTaskEl.parentNode.removeChild(oldTaskEl)

    const formData = getFormData(form)
    
    const newTask = oldTask
    Object.assign(newTask, formData, {
      durationInMinutes: convert(formData.duration),
      date: new Date(formData.date)
    })

    storage.add(newTask)
    render.drawTask(newTask)
  }

  form.addEventListener('submit', onSubmit)
}

function handleDragAndDrop(cells, render, storage) {
  const onDragOver = evt => {
    evt.preventDefault()
  }

  const onDrop = evt => {
    const targetCell = evt.target
    const taskEl = document.getElementById(evt.dataTransfer.getData('taskId'))

    if ( targetCell.className !== 'time-share' ) return
    
    targetCell.appendChild(taskEl)
  }

  cells.forEach(cell => {
    cell.addEventListener('dragover', onDragOver)
    cell.addEventListener('drop', onDrop)
  })
}











