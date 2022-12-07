import {Attribute} from "src/api/Attribute";

class CategoryAttribute {
  name: string;
  icon: string;

  constructor(name?: string, icon?: string) {
    this.name = name ? name : "";
    this.icon = icon ? icon : "";
  }
}

export class CategoryClass {
  id: string;
  name: string;
  description: string;
  attributes: CategoryAttribute[];

  constructor({
                id,
                name,
                description,
                attributes
              }: { id?: string, name?: string, description?: string, attributes?: string }) {
    this.id = id ? id : "";
    this.name = name ? name : "";
    this.description = description ? description : "";
    this.attributes = attributes ? JSON.parse(attributes).map((attribute: { name: string, icon: string }) => {
      return new Attribute(attribute.name, attribute.icon);
    }) : [];
  }

  getJSONString(){
    return JSON.stringify(this);
  }
}
