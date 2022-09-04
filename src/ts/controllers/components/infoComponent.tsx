import { MenuComponent } from "./menuComponent";

const CSS = {
    table: 'width-100 align-center',
};

const controlButtons = {
    next: {
        value: "Продолжить",
        isActive: () => true,
    },
    back: {
        value: "Назад",
        isActive: () => true,
    },
};

type TButtonsConfig = { next: boolean, back: boolean };

export const ButtonsConfig = {
    onlyNext: { next: true, back: false } as TButtonsConfig,
    onlyBack: { next: false, back: true } as TButtonsConfig,
    both: { next: true, back: true } as TButtonsConfig,
};

export class InfoComponent extends MenuComponent {
    infoConfig: {
        currentItem: number;
        items: Render.TChild[];
    };
    constructor(content: Render.TChild[], buttonsConfig: TButtonsConfig, addCounter: boolean = false) {
        const buttons = [
            ...(buttonsConfig.next ? [controlButtons.next] : []),
            ...(buttonsConfig.back ? [controlButtons.back] : []),
        ];
        super(buttons);
        this.infoConfig = {
            currentItem: 0,
            items: addCounter
                ? content.map((value, index) => {
                    return <table class={CSS.table}>
                        <tr>
                            <td>
                                {index + 1} / {content.length}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {value}
                            </td>
                        </tr>
                    </table>
                })
                : content,
        };

        const instance = this;
        const info = this.infoConfig;
        this.menuConfig.actions[controlButtons.next.value] = function () {
            info.currentItem++;
            if (info.currentItem >= info.items.length) {
                instance.globalController.popController();
            }
        }
        this.menuConfig.actions[controlButtons.back.value] = function () {
            info.currentItem--;
            if (info.currentItem < 0) {
                instance.globalController.popController();
            }
        }
    }
    createElement(): HTMLElement {
        const menu = this.menuConfig;
        const info = this.infoConfig;
        menu.header = info.items[info.currentItem];
        return super.createElement();
    }
}