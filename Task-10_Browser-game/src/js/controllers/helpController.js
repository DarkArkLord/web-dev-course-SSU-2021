import { MenuComponent } from "./components/menuComponent";

const items = {
    back: {
        value: "Назад",
        isActive: () => true,
    },
};

export const helpController = new MenuComponent([items.back], { element: 'Помостч' });

helpController.customInit = (mainController) => {
    helpController.items.actions[items.back.value] = function() {
        mainController.popController();
    }
}