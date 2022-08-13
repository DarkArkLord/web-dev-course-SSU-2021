import { Commands } from "../controls";
import { MenuComponent } from "./components/menuComponent";

export class BattleController extends MenuComponent {
    constructor(level: number) {
        const buttons = {
            back: {
                value: "Назад",
                isActive: () => true,
            },
        };

        super([buttons.back], `Battle controller ${level}`);
        const instance = this;

        this.menuConfig.actions[buttons.back.value] = function () {
            instance.globalController.popController();
        }

        this.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
}