const container = document.getElementById('calendarContainer')

function render() {}

render.drawTable = function () {
  const header = elt('thead'), body = elt('tbody')
  const table = elt('table', {
    class: 'table table-bordered week', id: 'container' }, header, body)
  
  const columns = ['Hour', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const headerRow = header.appendChild(elt('tr'))
  for (const column of columns)
    headerRow.appendChild(elt('th', null, column))

  const hoursInADay = 24, daysInAWeek = 7
  for (let hours = 0; hours < hoursInADay; hours++) {
    const bodyRow = body.appendChild(elt('tr'))
    bodyRow.appendChild(elt('td', null, hours + 'h'))
    for (let weekday = 1; weekday <= daysInAWeek; weekday++) {
      bodyRow.appendChild(elt('td', {
        class: 'time-share',
        'data-cell-time': JSON.stringify({ weekday, hours }),
      }))
    }
  }

  container.appendChild(table)
}

render.drawTask = function (task, targetCell) {
  const parent = targetCell ?? getParentEl(task)
  const { x, y, height } = getBounding(task, parent)

  const status = elt('input', {
    type: 'checkbox', name: 'status', id: 'status'
  })
  status.checked = task.checked
  const element = elt('div', {
    class: 'task',
    style: `left: ${x}px; top: ${y}%; height: ${height}px; background: ${task.color}`,
    onmousedown: `(e => e.stopPropagation())(event)`,
    'data-bs-toggle': 'modal',
    'data-bs-target': '#task-settings'
  },
    elt('div', { class: 'name' }, elt('p', { class: 'h6 text-white' }, task.name)),
    elt('div', { class: 'status' }, status))
  
  parent.appendChild(element)
  
  return element
}

function getBounding(task, parent) {
  const cellHeight = parent.getBoundingClientRect().height
  const minutesPerHour = 60, ratio = cellHeight / minutesPerHour
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