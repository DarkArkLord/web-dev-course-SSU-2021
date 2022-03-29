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

type TMenuItems = {
    list: TMenuItem[],
    actions: TMenuItemsActions,
}

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
    header: HTMLElement;
    footer: HTMLElement;
    items: TMenuItems;
    currentItem: NumberEnumerator;

    constructor(items: TMenuItem[], header?: HTMLElement, footer?: HTMLElement) {
        super();
        let instance = this;

        this.header = header;
        this.footer = footer;

        this.items = {
            list: items,
            actions: {}
        };

        this.currentItem = new NumberEnumerator(0, items.length - 1, 0);

        this.commandActions[Commands.Up] = function () {
            instance.currentItem.prev();
        };
        this.commandActions[Commands.Down] = function () {
            instance.currentItem.next();
        };
        this.commandActions[Commands.Use] = function () {
            let currentIndex = instance.currentItem.current();
            instance.useItem(currentIndex);
        };
    }

    private useItem(index: number) {
        let item = this.items.list[index];
        if (item && item.isActive()) {
            let action = this.items.actions[item.value];
            if (action) {
                action();
            }
        }
    }

    onPush(globalController: IGlobalController): void {
        super.onPush(globalController);
        this.currentItem.reset();
    }

    createElement(): HTMLElement {
        let instance = this;

        function HeaderComponent() {
            if (instance.header) {
                return <tr>
                    <td>
                        {instance.header}
                    </td>
                </tr>;
            }
            return <></>
        }

        function ItemsListComponent() {
            return <tr>
                <td>
                    <ul class={CSS.list}>
                        {instance.items.list.map((item, index) => {
                            let elementClass = getItemClass(item, index, instance.currentItem);
                            let element = (<li class={elementClass}>{item.value}</li>) as HTMLElement;
                            element.onclick = () => instance.useItem(index);
                            return element;
                        })}
                    </ul>
                </td>
            </tr>;
        }

        function FooterComponent() {
            if (instance.footer) {
                return <tr>
                    <td>
                        {instance.footer}
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