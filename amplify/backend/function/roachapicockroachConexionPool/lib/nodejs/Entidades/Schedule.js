"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = exports.ScheduleDay = exports.Shift = void 0;
class Shift {
    constructor({ from, to }) {
        this.from = from ? from : "";
        this.to = to ? to : "";
    }
}
exports.Shift = Shift;
class ScheduleDay {
    constructor({ active, shifts }) {
        this.active = active ? active : false;
        this.shifts = shifts ? shifts : [new Shift({})];
    }
}
exports.ScheduleDay = ScheduleDay;
class Schedule {
    resolveDay(day) {
        if (day) {
            if (!(day instanceof ScheduleDay) && day.from !== undefined) {
                return new ScheduleDay({ active: day.active, shifts: [new Shift({ from: day.from, to: day.to })] });
            }
            else {
                if (!(day instanceof ScheduleDay) || day.shifts) {
                    return day;
                }
                else {
                    return new ScheduleDay({});
                }
            }
        }
        else {
            return new ScheduleDay({});
        }
    }
    constructor({ monday, tuesday, wednesday, thursday, friday, saturday, sunday }) {
        this.monday = this.resolveDay(monday);
        this.tuesday = this.resolveDay(tuesday);
        this.wednesday = this.resolveDay(wednesday);
        this.thursday = this.resolveDay(thursday);
        this.friday = this.resolveDay(friday);
        this.saturday = this.resolveDay(saturday);
        this.sunday = this.resolveDay(sunday);
    }
}
exports.Schedule = Schedule;
