export default function WeekDayParser(weekDayNumber: number, capitalized: boolean = false): string {
    let weekDayStr = ""
    switch (weekDayNumber) {
        case 1: weekDayStr = "segunda"; break;
        case 2: weekDayStr = "terça"; break;
        case 3: weekDayStr = "quarta"; break;
        case 4: weekDayStr = "quinta"; break;
        case 5: weekDayStr = "sexta"; break;
        case 6: weekDayStr = "sábado"; break;
        case 7: weekDayStr = "domingo"; break;
        default: weekDayStr = "undefined"
    }
    return capitalized
        ? `${ weekDayStr.charAt(0).toUpperCase() }${ weekDayStr.slice(1, weekDayStr.length) }`
        : weekDayStr
}