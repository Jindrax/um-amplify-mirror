class ScheduleDay{
  active: boolean;
  from: string;
  to: string;

  constructor(active: boolean, from: string, to: string) {
    this.active = active;
    this.from = from;
    this.to = to;
  }
}

export class Schedule{
  monday: ScheduleDay;
  tuesday: ScheduleDay;
  wednesday: ScheduleDay;
  thursday: ScheduleDay;
  friday: ScheduleDay;
  saturday: ScheduleDay;
  sunday: ScheduleDay;

  constructor(data?: string) {
    if(data){
      const obj = JSON.parse(data);
      this.monday = new ScheduleDay(obj.monday.active, obj.monday.from, obj.monday.to);
      this.tuesday = new ScheduleDay(obj.tuesday.active, obj.tuesday.from, obj.tuesday.to);
      this.wednesday = new ScheduleDay(obj.wednesday.active, obj.wednesday.from, obj.wednesday.to);
      this.thursday = new ScheduleDay(obj.thursday.active, obj.thursday.from, obj.thursday.to);
      this.friday = new ScheduleDay(obj.friday.active, obj.friday.from, obj.friday.to);
      this.saturday = new ScheduleDay(obj.saturday.active, obj.saturday.from, obj.saturday.to);
      this.sunday = new ScheduleDay(obj.sunday.active, obj.sunday.from, obj.sunday.to);
    }else{
      this.monday = new ScheduleDay(false, "", "");
      this.tuesday = new ScheduleDay(false, "", "");
      this.wednesday = new ScheduleDay(false, "", "");
      this.thursday = new ScheduleDay(false, "", "");
      this.friday = new ScheduleDay(false, "", "");
      this.saturday = new ScheduleDay(false, "", "");
      this.sunday = new ScheduleDay(false, "", "");
    }
  }

  getJSONString(){
    return JSON.stringify(this);
  }
}
