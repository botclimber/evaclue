function zeroAsPrefix(v: number): string {
    if(v < 10) return `0${v}`
    else return `${v}`
}

export function genNewDate(): formatTypes.dateFormat  {
    
    const date = new Date()

    const year = zeroAsPrefix(date.getFullYear())
    const month = zeroAsPrefix(date.getMonth()+1) // it goes from 0 - 11
    const day = zeroAsPrefix(date.getDate())
    const hour = zeroAsPrefix(date.getHours())
    const min = zeroAsPrefix(date.getMinutes())
    const sec = zeroAsPrefix(date.getSeconds())

    const currentDate: formatTypes.dateFormat = `${year}-${month}-${day} ${hour}:${min}:${sec}`

    return currentDate
}