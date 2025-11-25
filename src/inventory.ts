import { Resource } from './resources';

class Inventory {
  private resources: Map<Resource, number>;

  constructor() {
    this.resources = new Map();
  }

  public addResource(resource: Resource, amount: number) {
    const currentAmount = this.resources.get(resource) || 0;
    this.resources.set(resource, currentAmount + amount);
    console.log(`Collected ${amount} of ${Resource[resource]}. Total: ${this.resources.get(resource)}`);
  }

  public getResourceAmount(resource: Resource): number {
    return this.resources.get(resource) || 0;
  }
}

export default Inventory;
