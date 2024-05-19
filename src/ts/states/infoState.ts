import { HTMLTags, render } from "../utils/render";
import { BaseMenuState } from "./baseStates/baseMenuState";

const CSS = {
    table: 'width-100 align-center',
};

const controlButtons = {
    next: {
        value: "Продолжить",
        description: () => "Продолжить",
        isActive: () => true,
    },
    back: {
        value: "Назад",
        description: () => "Назад",
        isActive: () => true,
    },
};

type TButtonsConfig = { next: boolean, back: boolean };

export const InfoButtonsConfig = {
    onlyNext: { next: true, back: false } as TButtonsConfig,
    onlyBack: { next: false, back: true } as TButtonsConfig,
    both: { next: true, back: true } as TButtonsConfig,
};

export class InfoState extends BaseMenuState {
    private infoConfig: {
        items: string[],
        currentItem: number,
        showCounter: boolean,
    };

    constructor(content: string[], buttonsConfig: TButtonsConfig, showCounter: boolean) {
        const buttons = getButtonsList();

        super("Информация", buttons);

        const instance = this;
        const info = this.infoConfig = {
            items: content,
            currentItem: 0,
            showCounter,
        };

        this.menuConfig.actions[controlButtons.next.value] = function () {
            info.currentItem++;
            if (info.currentItem >= info.items.length) {
                instance.statesController.popState();
            }
        }
        this.menuConfig.actions[controlButtons.back.value] = function () {
            info.currentItem--;
            if (info.currentItem < 0) {
                instance.statesController.popState();
            }
        }

        function getButtonsList() {
            const buttons = [];
            if (buttonsConfig.next) {
                buttons.push(controlButtons.next);
            }
            if (buttonsConfig.back) {
                buttons.push(controlButtons.back);
            }
            return buttons;
        }
    }

    protected createHeaderElement(): Render.TChild {
        const info = this.infoConfig;
        const currentItem = info.items[info.currentItem];

        if (info.showCounter) {
            return render(HTMLTags.Table, { class: CSS.table },
                render(HTMLTags.TableRow, null,
                    render(HTMLTags.TableData, null,
                        `${info.currentItem + 1} / ${info.items.length}`
                    ),
                ),
                render(HTMLTags.TableRow, null,
                    render(HTMLTags.TableData, null,
                        currentItem
                    ),
                ),
            );
        }

        return currentItem;
    }
}