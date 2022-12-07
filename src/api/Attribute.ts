export class Attribute{
  name: string;
  icon: string;

  constructor(name?: string, icon?: string) {
    this.name = name? name: "";
    this.icon = icon? icon: "";
  }
}
