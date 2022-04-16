import { BaseController } from "./baseController";
import { NumberEnumerator } from "../../utils/common";
import { Commands } from "../../controls";

const CSS = {
    table: 'width_100 align_center',
    list: 'menu-container align_center',
    item: {
        default: 'menu-default-item',
        current: 'menu-current-item',
        disable: 'menu-disable-item',
    },
};

type TMenuItem = {
    value: string,
    isActive: () => boolean,
};

type TMenuItemsActions = {
    [value: string]: () => void
};

function getItemClass(item: TMenuItem, index: number, enumerator: NumberEnumerator) {
    let classes = [
        item.isActive()
            ? CSS.item.default
            : CSS.item.disable
    ];

    if (index == enumerator.current()) {
        classes.push(CSS.item.current);
    }

    return classes.join(' ');
}

export class MenuComponent extends BaseController {
    menuConfig: {
        header: HTMLElement;
        footer: HTMLElement;
        items: TMenuItem[];
        actions: TMenuItemsActions;
        currentItem: NumberEnumerator;
    };

    constructor(items: TMenuItem[], header?: HTMLElement, footer?: HTMLElement) {
        super();
        let instance = this;

        this.menuConfig.header = header;
        this.menuConfig.footer = footer;

        this.menuConfig.items = items;

        this.menuConfig.currentItem = new NumberEnumerator(0, items.length - 1, 0);

        this.commandActions[Commands.Up] = function () {
            instance.menuConfig.currentItem.prev();
        };
        this.commandActions[Commands.Down] = function () {
            instance.menuConfig.currentItem.next();
        };
        this.commandActions[Commands.Use] = function () {
            let currentIndex = instance.menuConfig.currentItem.current();
            instance.useItem(currentIndex);
        };
    }

    private useItem(index: number) {
        let item = this.menuConfig.items[index];
        if (item && item.isActive()) {
            let action = this.menuConfig.actions[item.value];
            if (action) {
                action();
            }
        }
    }

    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        this.menuConfig.currentItem.reset();
    }

    createElement(): HTMLElement {
        let instance = this;

        function HeaderComponent() {
            if (instance.menuConfig.header) {
                return <tr>
                    <td>
                        {instance.menuConfig.header}
                    </td>
                </tr>;
            }
            return <></>
        }

        function ItemsListComponent() {
            return <tr>
                <td>
                    <ul class={CSS.list}>
                        {instance.menuConfig.items.map((item, index) => {
                            let elementClass = getItemClass(item, index, instance.menuConfig.currentItem);
                            let element = (<li class={elementClass}>{item.value}</li>) as HTMLElement;
                            element.onclick = () => instance.useItem(index);
                            return element;
                        })}
                    </ul>
                </td>
            </tr>;
        }

        function FooterComponent() {
            if (instance.menuConfig.footer) {
                return <tr>
                    <td>
                        {instance.menuConfig.footer}
                    </td>
                </tr>;
            }
            return <></>
        }

        return <table class={CSS.table}>
            <HeaderComponent />
            <ItemsListComponent />
            <FooterComponent />
        </table>;
    }
}