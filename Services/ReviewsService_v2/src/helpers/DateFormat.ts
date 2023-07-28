export function genNewDate(): formatTypes.dateFormat  {
    const year = new Date().getFullYear
    const month = new Date().getMonth
    const day = new Date().getDay
    const hour = new Date().getHours
    const min = new Date().getMinutes
    const mili = new Date().getMilliseconds

    const currentDate: formatTypes.dateFormat = `${year}-${month}-${day} ${hour}:${min}:${mili}`

    return currentDate
}