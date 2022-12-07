import {Attribute} from "src/api/Attribute";

export class AttributeHandler {
  attributes: Attribute[];
  selectedAttributes: any[] = [];

  constructor(attributes?: string) {
    this.attributes = attributes? JSON.parse(attributes) : [];
  }

  public addAttribute(name:string, icon: string): AttributeHandler {
    this.attributes.push(new Attribute(name, icon));
    return this;
  }

  public getJSONString() {
    if (this.selectedAttributes.length > 0){
      this.attributes = [];
      for (let att of this.selectedAttributes){
        this.attributes.push(new Attribute(att.name, att.icon));
      }
      return JSON.stringify(this.attributes);
    }
    return JSON.stringify(this.attributes);
  }

  public getAttributes(){
    return this.attributes;
  }
}
