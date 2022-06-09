export default class WeekRender {
  constructor() {
    this.container = document.getElementById('calendarContainer')
  }

  drawCalendar(calendar) {
    const header = elt('thead'), body = elt('tbody')
    const table = elt('table', {
      class: 'table table-bordered week', id: 'container' }, header, body)

    const headerRow = header.appendChild(elt('tr'))
    headerRow.appendChild(elt('th', null, 'Hour'))
    for (let i = 0; i < calendar.WEEKDAYS.length; i++) {
      const column = `${calendar.WEEKDAYS[ i ]} ${calendar.week.start + i}`
      if ((calendar.week.start + i) === calendar.day) {
        headerRow.appendChild(elt('th', null, elt('span', {
          class: 'text-primary'
        }, column)))
        continue
      }
      headerRow.appendChild(elt('th', null, column))
    }

    const hoursInADay = 24
    for (let hours = 0; hours < hoursInADay; hours++) {
      const bodyRow = body.appendChild(elt('tr'))
      bodyRow.appendChild(elt('td', null, String(hours)))
      for (let day = calendar.week.start; day <= calendar.week.end; day++) {
        bodyRow.appendChild(elt('td', {
          class: 'time-share',
          'data-date-string': `${calendar.year}-${calendar.month}-${day} ${hours}:00`
        }))
      }
    }

    this.container.appendChild(table)
  }

  drawTask(task, targetCell) {
    const parent = targetCell ?? getParentEl(task)
    const { x, y, height } = getBounding(task, parent)

    const taskEl = elt('div', {
      class: 'task', id: task.id, draggable: true,
      style: `left: ${x}px; top: ${y}%; height: ${height}px; background: ${task.color}`,
      'data-bs-toggle': 'modal', 'data-bs-target': '#task-settings'
    },
      elt('div', { class: 'name' }, elt('p', { class: 'h6 text-white' }, task.name)))

    parent.appendChild(taskEl)

    taskEl.addEventListener('click', task.onClick.bind(task))
    taskEl.addEventListener('mousedown', task.stopPropagation)
    taskEl.addEventListener('dragstart', task.onDragStart)
    taskEl.addEventListener('drop', task.stopPropagation)
  }
}

function getBounding(task, parent) {
  const cellHeight = parent.getBoundingClientRect().height
  const minutesPerHour = 60, ratio = cellHeight / minutesPerHour
  return {
    x: 0, y: task.date.getMinutes() / 60 * 100,
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