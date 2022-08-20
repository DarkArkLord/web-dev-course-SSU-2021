import { Commands } from "../controls";
import { renderCharacter } from "../rpg/characterToHtml";
import { ButtonsConfig, InfoComponent } from "./components/infoComponent";

export class ShowStatesController extends InfoComponent {
    constructor(character: RPG.TCharacter) {
        const states = renderCharacter(character);

        super([states], ButtonsConfig.onlyBack);
        const instance = this;

        instance.commandActions[Commands.Back] = function () {
            instance.globalController.popController();
        }
    }
}