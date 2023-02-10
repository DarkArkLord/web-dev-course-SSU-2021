import { BaseController } from "./baseController";
import { NumberEnumerator } from "../../utils/common";
import { Commands } from "../../controls";

const CSS = {
    table: 'width-100 align-center',
    list: 'menu-container align-center',
    item: {
        default: 'menu-default-item',
        current: 'menu-current-item',
        disable: 'menu-disable-item',
    },
};

type TMenuItemsActions = TDictionary<() => void>;

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
        header: Render.TChild;
        footer: Render.TChild;
        items: TMenuItem[];
        actions: TMenuItemsActions;
        currentItem: NumberEnumerator;
    };

    constructor(items: TMenuItem[], header?: Render.TChild, footer?: Render.TChild) {
        super();
        const instance = this;
        this.menuConfig = {
            header: header,
            footer: footer,
            items: items,
            actions: {},
            currentItem: new NumberEnumerator(0, items.length - 1, 0),
        };

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
        const instance = this;

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
                            const elementClass = getItemClass(item, index, instance.menuConfig.currentItem);
                            const element = (<li class={elementClass}>{item.description}</li>) as HTMLElement;
                            element.onclick = () => {
                                instance.useItem(index);
                                instance.globalController.reDraw();
                            };
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