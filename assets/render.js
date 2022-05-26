const container = document.getElementById('calendarContainer')

function render() {}

render.prototype.drawTable = function () {
  const header = elt('thead'), body = elt('tbody')
  const table = el('table', {
    class: 'table table-bordered week', id: 'container' }, header, body)
  
  const columns = ['Hour', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const headerRow = header.appendChild(elt('tr'))
  for (const column of columns)
    headerRow.appendChild(elt('th', null, column))

  const hoursInADay = 24, daysInAWeek = 7
  for (let hour = 0; hour < hoursInADay; hour++) {
    const bodyRow = body.appendChild(elt('tr'))
    bodyRow.appendChild(elt('td', null, hour + 'h'))
    for (let day = 1; day <= daysInAWeek; day++) {
      bodyRow.appendChild(elt('td', {
        class: 'time-share',
        'data-week-day': day,
        'data-hour': hour
      }))
    }
  }

  container.appendChild(table)
}

render.prototype.drawTask = function (task) {
  const { x, y, height } = getBounding(task)
  const parent = target || getParentEl(task)

  const status = elt('input', {
    type: 'checkbox', name: 'status', id: 'status'
  })
  status.checked = task.checked
  const element = elt('div', {
    class: 'task',
    style: `left: ${x}px; top: ${y}%; height: ${height}px; background: ${task.colorRGB}`,
    'data-bs-toggle': 'modal',
    'data-bs-target': '#taskSettings'
  },
    elt('div', { class: 'name' }, elt('p', { class: 'h6 text-white' }, task.name)),
    elt('div', { class: 'status' }, status))
  
  task.el = element
  parent.appendChild(element)
  
  return element
}

function getBounding(task) {
  const cellHeight = 40, minutesPerHour = 60 // temp
  const ratio = cellHeight / minutesPerHour
  return {
    x: 0,
    y: task.date.getMinutes() / 60 * 100,
    height: Math.max(task.durationInMinutes * ratio, 20)
  }
}

function getParentEl(task) {
  const [hours, weekDay] = [task.date.getHours(), task.date.getDay()]
  const daysInAWeek = 7
  const cells = container.querySelectorAll('td.time-share')
  const parent = cells[weekDay + (daysInAWeek * hours)]

  return parent
}

function elt(node, attributes, ...children) {
  const el = document.createElement(node)
  for (const attr in attributes) {
    el.setAttribute(attr, attributes[attr])
  }
  children.forEach(child => {
    if (typeof child === "string") {
      return el.appendChild(document.createTextNode(child))
    }
    el.appendChild(child)
  })
  return el
}