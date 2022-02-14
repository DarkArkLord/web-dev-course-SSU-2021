import { MenuComponent } from './menuComponent.js'
import { GlobalController } from './globalController.js'

const menuItems = {
    item1: {
        value: "item1",
        isActive: () => true,
    },
    item2: {
        value: "item2",
        isActive: () => false,
    },
    item3: {
        value: "item3",
        isActive: () => true,
    },
};

let menu = new MenuComponent([menuItems.item1, menuItems.item2, menuItems.item3], { element: 'header' }, { element: 'footer' });

menu.items.actions[menuItems.item1.value] = function() {
    alert(menuItems.item1.value);
}
menu.items.actions[menuItems.item2.value] = function() {
    alert(menuItems.item2.value);
}
menu.items.actions[menuItems.item3.value] = function() {
    alert(menuItems.item3.value);
}

export const mainController = new GlobalController(menu);

mainController.init();