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
  const timeDisplay = document.querySelector('.currentMonthAndYear')
  const displayContent = timeDisplay.textContent

  timeDisplay.textContent = displayContent.replace('MONTH YEAR', `${calendar.month} ${calendar.year}`)
}

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

    const amount = function (string) {
      const regexp = /^(\d{1,2}):(\d{1,2})$/
      const match = string.match(regexp)
      const [, hours, minutes] = match
      const durationInMinutes = parseInt(hours) * 60 + parseInt(minutes)
  
      return durationInMinutes
    }

    const hoursAndMinutes = function (string) {
      const regexp = /^(\d{1,2}):(\d{1,2})$/
      const match = string.match(regexp)
      const [, hours, minutes] = match

      return [ hours, minutes ]
    }

    const elements = form.elements
    const taskId = elements.id.value
    const task = calendar.remove(taskId)
    const oldTaskEl = document.getElementById(taskId)

    oldTaskEl.parentNode.removeChild(oldTaskEl)

    task.name = elements.name.value
    task.durationInMinutes = amount(elements.duration.value)
    const [ hours, minutes ] = hoursAndMinutes(elements.time.value)
    task.date.setHours(hours)
    task.date.setMinutes(minutes)
    task.repeatAlways = elements.repeatAlways.checked
    task.color = elements.color.value
    task.description = elements.description.value

    render.drawTask(task)
    calendar.add(task)
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