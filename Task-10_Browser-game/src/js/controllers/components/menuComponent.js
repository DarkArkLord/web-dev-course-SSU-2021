import { HTMLTags } from '../../render.js'
import { Commands } from '../../controls.js'
import { IndexEnumerator } from '../../utils.js'

const defaultstyleClasses = {
    table: 'width_100 align_center',
    item: {
        default: 'default-menu-item',
        current: 'current-menu-item',
        disable: 'disable-menu-item',
    },
};

export function MenuComponent(items, headerElement, footerElement, styleClasses = defaultstyleClasses) {
    let instance = this;
    this.header = headerElement;
    this.footer = footerElement;
    this.items = {
        list: items,
        actions: {},
    };
    this.styleClasses = styleClasses
    this.currentItem = new IndexEnumerator(0, this.items.list.length - 1, 0);
    this.commandActions = {
        [Commands.Up]: function() {
            instance.currentItem.prev();
        },
        [Commands.Down]: function() {
            instance.currentItem.next();
        },
        [Commands.Use]: function() {
            let item = instance.items.list[instance.currentItem.current()];
            if (item && item.isActive()) {
                let action = instance.items.actions[item.value];
                if (action) {
                    action();
                }
            }
        },
        [Commands.Left]: function() {},
        [Commands.Right]: function() {},
        [Commands.Back]: function() {},
    };
};

MenuComponent.prototype = {
    executeCommand(command) {
        let action = this.commandActions[command];
        if (action) {
            action();
        }
    },
    createElement() {
        let table = {
            tag: HTMLTags.Table,
            attributes: { class: this.styleClasses.table },
            childs: []
        };

        if (this.header) {
            let element = {
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [this.header]
                    }
                ]
            };
            table.childs.push(element);
        }

        for (let itemIndex in this.items.list) {
            let item = this.items.list[itemIndex];
            let elementClass = item.isActive()
                ? this.styleClasses.item.default
                : this.styleClasses.item.disable;
            if (itemIndex == this.currentItem.current()) {
                elementClass += ' ' + this.styleClasses.item.current;
            }
            table.childs.push({
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        attributes: { class: elementClass },
                        value: '- ' + item.value
                    }
                ]
            });
        }

        if (this.footer) {
            table.childs.push({
                tag: HTMLTags.TableRow,
                childs: [
                    {
                        tag: HTMLTags.TableData,
                        childs: [this.footer]
                    }
                ]
            });
        }

        return table;
    }
};