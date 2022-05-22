function createDisplay(dispatcher) {
  const defaultViewLayout = 'week'
  const container = document.getElementById('calendarContainer')
  const drawTypes = Object.create({
    week: renderWeek,
    month: renderMonth,
    day: renderDay
  })

  dispatcher.addListener('start', activities => {
    display.drawCalendar(defaultViewLayout)
    
    for (const activityId in activities) {
      const activity = activities[activityId]
      display.drawActivity(activity)
    }
  })

  dispatcher.addListener('new activity', drawActivity)

  function renderWeek() {
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
    for (let hour = 0; hour < hoursInADay; hour++) {
      const bodyRow = body.appendChild(elt('tr'))
      bodyRow.appendChild(elt('td', null, hour + 'h'))
      for (let day = 0; day < daysInAWeek; day++) {
        bodyRow.appendChild(elt('td'))
      }
    }

    return table
  }

  function renderDay() {
    const header = elt('thead'), body = elt('tbody')
    const table = elt('table', {
      class: 'table table-bordered day', id: 'container' }, header, body)

    const columns = ['Hour', 'Sunday']
    const headerRow = header.appendChild(elt('tr'))
    for (const column of columns) {
      headerRow.appendChild(elt('th', null, column))
    }

    const hoursInADay = 24
    for (let hour = 0; hour < hoursInADay; hour++) {
      const bodyRow = body.appendChild(elt('tr'))
      bodyRow.appendChild(elt('td', null, hour + 'h'))
      bodyRow.appendChild(elt('td'))
    }

    return table
  }

  function renderMonth() {
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
    for (let week = 1; week <= weeksInAMonth; week++) {
      const bodyRow = body.appendChild(elt('tr'))
      for (let day = 0; day < daysInAWeek; day++) {
        bodyRow.appendChild(elt('td'))
      }
    }

    return table
  }
  
  function drawCalendar(viewLayout) {
    const renderCalendar = drawTypes[viewLayout]
    const calendar = renderCalendar()

    container.appendChild(calendar)
  }


  function drawActivity(activity) {
    const activityEl = elt('div', { class: 'activity' } ,
      elt('div', { class: 'name'}, elt('p', { class: 'h6 text-white' }, activity.name)) ,
      elt('div', { class: 'status'}, elt('input', {
        type: 'checkbox',
        name: 'status',
        id: 'status',
        checked: activity.checked
      })))
  
    activity.el = activityEl
    container.appendChild(activityEl)
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

  return {
    drawCalendar,
    drawActivity
  }
}