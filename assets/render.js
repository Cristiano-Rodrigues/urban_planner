function drawTable(viewLayout) {
  const drawTypes = Object.create(null)

  drawTypes.week = () => {
    const header = elt('thead'), body = elt('tbody')
    const table = elt('table', {
      class: 'table table-bordered week', id: 'container' }, header, body)

    const columns = [
      'Hour',
      'Sunday',
      'Monday',
      'Tuesday',
      'Weednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    const headerRow = header.appendChild(elt('tr'))
    for (const column of columns) {
      headerRow.appendChild(elt('th', null, column))
    }

    const hoursInADay = 24, daysInAWeek = 7
    for (let hour = 1; hour <= hoursInADay; hour++) {
      const bodyRow = body.appendChild(elt('tr'))
      bodyRow.appendChild(elt('td', null, String(hour)))
      for (let day = 0; day < daysInAWeek; day++) {
        bodyRow.appendChild(elt('td'))
      }
    }

    return table
  }

  drawTypes.day = () => {
    const header = elt('thead'), body = elt('tbody')
    const table = elt('table', {
      class: 'table table-bordered day', id: 'container' }, header, body)

    const columns = ['Hour', 'Sunday']
    const headerRow = header.appendChild(elt('tr'))
    for (const column of columns) {
      headerRow.appendChild(elt('th', null, column))
    }

    const hoursInADay = 24
    for (let hour = 1; hour <= hoursInADay; hour++) {
      const bodyRow = body.appendChild(elt('tr'))
      bodyRow.appendChild(elt('td', null, String(hour)))
      bodyRow.appendChild(elt('td'))
    }

    return table
  }

  drawTypes.month = () => {
    const header = elt('thead'), body = elt('tbody')
    const table = elt('table', {
      class: 'table table-bordered month', id: 'container' }, header, body)

    const columns = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Weednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    const headerRow = header.appendChild(elt('tr'))
    for (const column of columns) {
      headerRow.appendChild(elt('th', null, column))
    }

    const weeksInAMonth = 6, daysInAWeek = 7
    for (let hour = 1; hour <= weeksInAMonth; hour++) {
      const bodyRow = body.appendChild(elt('tr'))
      for (let day = 0; day < daysInAWeek; day++) {
        bodyRow.appendChild(elt('td'))
      }
    }

    return table
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

  return drawTypes[viewLayout]()
}

const container = document.getElementById('calendarContainer')
container.appendChild(
  drawTable('month')
)