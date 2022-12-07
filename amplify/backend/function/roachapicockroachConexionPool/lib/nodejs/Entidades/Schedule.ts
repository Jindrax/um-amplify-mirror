export class Shift {
    from: string;
    to: string;

    constructor({from, to}: { from?: string, to?: string }) {
        this.from = from ? from : "";
        this.to = to ? to : "";
    }
}

export class ScheduleDay {
    active: boolean;
    shifts: Shift[];

    constructor({active, shifts}: { active?: boolean, shifts?: Shift[] }) {
        this.active = active ? active : false;
        this.shifts = shifts ? shifts : [new Shift({})];
    }
}

export interface OldScheduleDay {
    from: string;
    to: string;
    active: boolean;
}

export class Schedule {
    monday: ScheduleDay;
    tuesday: ScheduleDay;
    wednesday: ScheduleDay;
    thursday: ScheduleDay;
    friday: ScheduleDay;
    saturday: ScheduleDay;
    sunday: ScheduleDay;

    resolveDay(day: ScheduleDay | OldScheduleDay | undefined): ScheduleDay  {
        if (day) {
            if (!(day instanceof ScheduleDay) && day.from !== undefined) {
                return new ScheduleDay({active: day.active, shifts: [new Shift({from: day.from, to: day.to})]});
            } else {
                if (!(day instanceof ScheduleDay) || day.shifts) {
                    return day as ScheduleDay;
                } else {
                    return new ScheduleDay({});
                }
            }
        } else {
            return new ScheduleDay({});
        }
    }

    constructor({
                    monday,
                    tuesday,
                    wednesday,
                    thursday,
                    friday,
                    saturday,
                    sunday
                }: { monday?: ScheduleDay, tuesday?: ScheduleDay, wednesday?: ScheduleDay, thursday?: ScheduleDay, friday?: ScheduleDay, saturday?: ScheduleDay, sunday?: ScheduleDay }) {
        this.monday = this.resolveDay(monday);
        this.tuesday = this.resolveDay(tuesday);
        this.wednesday = this.resolveDay(wednesday);
        this.thursday = this.resolveDay(thursday);
        this.friday = this.resolveDay(friday);
        this.saturday = this.resolveDay(saturday);
        this.sunday = this.resolveDay(sunday);
    }

}
