import { ButtonsConfig, InfoComponent } from "./components/infoComponent";

const CSS = {
    table: 'width_100 align_center',
};

export class ShowStatesController extends InfoComponent {
    constructor() {
        super(['Характеристики'], ButtonsConfig.onlyBack);
    }
    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        const gameInfo = JSON.stringify(globalController.gameData);
        this.infoConfig.items = [
            <table class={CSS.table}>
                <tr>
                    <td>
                        Характеристики
                    </td>
                </tr>
                <tr>
                    <td>
                        {gameInfo}
                    </td>
                </tr>
            </table>
        ];
    }
}