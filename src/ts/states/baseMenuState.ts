import { Commands } from "../controls";
import { NumberEnumerator } from "../utils/common";
import { HTMLTags, render } from "../utils/render";
import { BaseState } from "../utils/stateMachine";

const CSS = {
    table: 'width-100 align-center',
    list: 'menu-container align-center',
    item: {
        default: 'menu-default-item',
        current: 'menu-current-item',
        disable: 'menu-disable-item',
    },
};

type TMenuItem = {
    value: string,
    description: () => string,
    isActive: () => boolean,
};

type TMenuItemsActions = {
    [value: string]: () => void
};

type TMenuConfig = {
    items: TMenuItem[],
    actions: TMenuItemsActions,
    currentItem: NumberEnumerator,
};

function getItemClass(item: TMenuItem, index: number, currentItemIndex: number) {
    let classes = [
        item.isActive()
            ? CSS.item.default
            : CSS.item.disable
    ];

    if (index == currentItemIndex) {
        classes.push(CSS.item.current);
    }

    return classes.join(' ');
}

export abstract class BaseMenuState extends BaseState {
    protected menuConfig: TMenuConfig;

    constructor(stateTitle: string, items: TMenuItem[]) {
        super(stateTitle);
        const instance = this;

        this.menuConfig = {
            items,
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
            const currentIndex = instance.menuConfig.currentItem.current();
            this.useMenuItem(currentIndex);
        };
    }

    protected useMenuItem(index: number) {
        const currentItem = this.menuConfig.items[index];
        if (currentItem && currentItem.isActive()) {
            const action = this.menuConfig.actions[currentItem.value];
            if (action) {
                action();
            }
        }
    }

    public onStateCreating(): void {
        super.onStateCreating();
        this.menuConfig.currentItem.reset();
    }

    // --- !!! При pop из стека значение не сбрасывается !!! ---
    // public onStatePop(): void {
    //     super.onStatePop();
    //     this.menuConfig.currentItem.reset();
    // }

    protected createHeaderElement(): HTMLElement | undefined {
        return undefined;
    }

    protected createItemsListElement() {
        // TODO: добавить максимальное количество отображаемых строк
        const instance = this;
        const menuConfig = this.menuConfig;
        const currentItemIndex = menuConfig.currentItem.current();
        const items = menuConfig.items
            .map((item, index) => {
                const elementClass = getItemClass(item, index, currentItemIndex);
                const element = render(HTMLTags.ListItem, { class: elementClass }, item.description());
                element.onclick = () => {
                    instance.useMenuItem(index);
                    instance.invokeReDraw();
                };
                return element;
            });

        return render(HTMLTags.TableRow, null,
            render(HTMLTags.TableData, null,
                render(HTMLTags.UnorderedList, { class: CSS.list },
                    ...items
                )
            )
        )
    }

    protected createFooterElement(): HTMLElement | undefined {
        return undefined;
    }
}