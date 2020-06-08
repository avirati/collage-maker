interface IMenuItems {
  label: string;
}

class ContextMenu {
  public dom = document.createElement('div');
  public containerClassName: string;
  public menuItemClassName: string;

  constructor (containerClassName: string, menuItemClassName: string) {
    this.containerClassName = containerClassName;
    this.menuItemClassName = menuItemClassName;
  }

  public renderMenu = (menuItems: IMenuItems[]) => {
    this.dom.className = this.containerClassName;
    this.dom.style.display = 'none';
    this.dom.innerHTML = '';
    menuItems.forEach((item) => {
      const menuDom = document.createElement('div');
      menuDom.innerText = item.label;
      menuDom.className = this.menuItemClassName;
      this.dom.appendChild(menuDom);
    });
  }

  public positionMenu = (left: number, top: number) => {
    this.dom.style.display = 'block';
    this.dom.style.left = `${left - 20}px`;
    this.dom.style.top = `${top - 20}px`;
  }
}

export const getMenu = (containerClassName: string, menuItemClassName: string) => new ContextMenu(containerClassName, menuItemClassName);
