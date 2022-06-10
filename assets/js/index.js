import Render from './render.js'
import Calendar from './calendar.js'
import Task from './task.js'

function start(Render, Calendar, Task) {
  const render = new Render()
  const calendar = new Calendar()
  
  render.drawCalendar(calendar)
  calendar.getWeeklyTasks().each(render.drawTask)
  updateTimeDisplay(calendar)
  addListeners(render, calendar, Task)
}

start(Render, Calendar, Task)

function updateTimeDisplay(calendar) {
  const display = document.querySelector('.currentMonthAndYear')
  const content = display.textContent

  const time = `${calendar.month} ${calendar.year}`
  display.textContent = content.replace('MONTH YEAR', time)
}

function addListeners(render, calendar, Task) {
  const cells = document.querySelectorAll('td.time-share')
  const form = document.getElementById('form')

  handleMouseDown(cells, render, calendar, Task)
  handleFormSubmit(form, render, calendar)
  handleDragAndDrop(cells, calendar)
  handleDeleteTask(form, calendar)
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

function handleFormSubmit(form, render, calendar) {
  const onSubmit = event => {
    event.preventDefault()

    const getTime = (string) => {
      const match = string.match(/^(\d{1,2}):(\d{1,2})$/)

      return { 
        hours: parseInt(match[1]), minutes: parseInt(match[2])
      }
    }

    const { elements } = form
    const taskId = elements.id.value
    const task = calendar.remove(taskId)
    const oldTaskEl = document.getElementById(taskId)
    const duration = getTime(elements.duration.value)
    const startTime = getTime(elements.time.value)
    
    oldTaskEl.parentNode.removeChild(oldTaskEl)

    task.date.setHours(startTime.hours)
    task.date.setMinutes(startTime.minutes)

    Object.assign(task, {
      name: elements.name.value,
      durationInMinutes: duration.hours * 60 + duration.minutes,
      repeatAlways: elements.repeatAlways.checked,
      color: elements.color.value,
      description: elements.description.value
    })

    render.drawTask(task)
    calendar.add(task)
  }

  form.addEventListener('submit', onSubmit)
}

function handleDragAndDrop(cells, calendar) {
  const onDragOver = evt => {
    evt.preventDefault()
  }

  const onDrop = evt => {
    const cell = evt.target
    const taskId = evt.dataTransfer.getData('taskId')
    const task = calendar.remove(taskId)
    const taskEl = document.getElementById(taskId)
    const minutes = task.date.getMinutes()
    const date = new Date(cell.getAttribute('data-date-string'))

    date.setMinutes(minutes)
    task.date = date
    
    cell.appendChild(taskEl)
    calendar.add(task)
  }

  cells.forEach(cell => {
    cell.addEventListener('dragover', onDragOver)
    cell.addEventListener('drop', onDrop)
  })
}

function handleDeleteTask(form, calendar) {
  const deleteButton = form.querySelector('#delete')
  
  const onClick = evt => {
    evt.preventDefault()

    const taskId = form.elements.id.value
    const taskEl = document.getElementById(taskId)
    
    taskEl.parentNode.removeChild(taskEl)
    calendar.remove(taskId)
  }

  deleteButton.addEventListener('click', onClick)
}