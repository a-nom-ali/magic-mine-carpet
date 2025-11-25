import Inventory from './inventory';
import { Resource, resourceProperties } from './resources';

class UI {
  private inventory: Inventory;
  private container: HTMLDivElement;

  constructor(inventory: Inventory) {
    this.inventory = inventory;
    this.container = this.createContainer();
    document.body.appendChild(this.container);
    this.render();
  }

  private createContainer(): HTMLDivElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '20px';
    container.style.left = '20px';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    container.style.padding = '10px';
    container.style.borderRadius = '5px';
    container.style.color = 'white';
    return container;
  }

  public render() {
    let html = '<h2>Inventory</h2>';
    html += '<ul>';
    for (const resource in Resource) {
      if (isNaN(Number(resource))) {
        const resourceEnum = Resource[resource as keyof typeof Resource];
        const amount = this.inventory.getResourceAmount(resourceEnum);
        if (amount > 0) {
          html += `<li>${resourceProperties[resourceEnum].name}: ${amount}</li>`;
        }
      }
    }
    html += '</ul>';
    this.container.innerHTML = html;
  }
}

export default UI;
