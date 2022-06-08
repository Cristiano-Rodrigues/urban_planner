import Render from './render.js'
import Calendar from './calendar.js'
import Task from './task.js'

function start(Render, Calendar, Task) {
  const render = new Render()
  const calendar = new Calendar()
  
  render.drawCalendar(calendar)
  calendar.getWeeklyTasks().each(render.drawTask)
  addListeners(render, calendar, Task)
}

start(Render, Calendar, Task)

function addListeners(render, calendar, Task) {
  const cells = document.querySelectorAll('td.time-share')
  const form = document.getElementById('form')

  handleMouseDown(cells, render, calendar, Task)
  handleFormSubmit(form, render, calendar, Task)
  handleDragAndDrop(cells, render, calendar, Task)
}

function handleMouseDown(cells, render, calendar, Task) {
  const onMouseDown = downEvt => {
    downEvt.preventDefault()

    const onMouseUp = upEvt => {
      document.removeEventListener('mouseup', onMouseUp)

      const dragHeight = upEvt.clientY - downEvt.clientY
        
      if (dragHeight <= 10) return
        
      const task = new Task(downEvt, upEvt)
      const targetCell = downEvt.target
        
      render.drawTask(task, targetCell)
      calendar.add(task)
    }
      
    document.addEventListener('mouseup', onMouseUp)
  }

  cells.forEach(cell => {
    cell.addEventListener('mousedown', onMouseDown)
  })
}

function handleFormSubmit(form, render, calendar, Task) {
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
    const oldTask = calendar.remove(taskId)
    const oldTaskEl = document.getElementById(oldTask.id)
    oldTaskEl.parentNode.removeChild(oldTaskEl)

    const formData = getFormData(form)
    
    const newTask = oldTask
    Object.assign(newTask, formData, {
      durationInMinutes: convert(formData.duration),
      date: new Date(formData.date)
    })

    calendar.add(newTask)
    render.drawTask(newTask)
  }

  form.addEventListener('submit', onSubmit)
}

function handleDragAndDrop(cells, render, calendar, Task) {
  const onDragOver = evt => {
    evt.preventDefault()
  }

  const onDrop = evt => {
    const cell = evt.target
    const taskId = evt.dataTransfer.getData('taskId')
    const task = calendar.remove(taskId)
    const taskEl = document.getElementById(taskId)

    const minutes = task.date.getMinutes()
    const cellDate = new Date(cell.getAttribute('data-date-string'))
    task.date = cellDate
    task.date.setMinutes(minutes)
    
    cell.appendChild(taskEl)
    calendar.add(task)
  }

  cells.forEach(cell => {
    cell.addEventListener('dragover', onDragOver)
    cell.addEventListener('drop', onDrop)
  })
}