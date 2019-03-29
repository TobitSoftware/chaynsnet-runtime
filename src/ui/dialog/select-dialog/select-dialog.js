/* @flow */
// $FlowIgnore
import classNames from 'classnames';
import htmlToElement from 'html-to-element';
import { chaynsInfo } from '../../../chayns-info';
import memorize from '../../../utils/memorize';
import { argbHexToRgba } from '../../../utils/convert';

import { DISPLAY_INIT, DISPLAY_ADD } from '../../../constants/select-dialog';

import type { Config, Item } from '../types/select-dailog';

export default class SelectDialog {
    $dialog: HTMLElement;
    items: Item[] = [];
    multiselect: boolean;
    quickfind: boolean;

    selectCB: (x: [])=>void;
    lastDisplayedIndex: number = 0;

    scrollElement: ?HTMLElement = null;

    constructor(config: Config, selectCB: (x: Item[])=>void) {
        this.items = config.list.map((item, i) => ({
            ...item,
            name: item.name.toString(),
            id: i,
            hidden: false
        }));
        this.multiselect = config.multiselect;
        this.quickfind = config.quickfind;

        this.selectCB = selectCB;
    }

    get element(): HTMLElement {
        if (this.$dialog) {
            return this.$dialog;
        }
        this.$dialog = htmlToElement('<div class="select-dialog"></div>');
        this.addToDom(DISPLAY_INIT, true);
        return this.$dialog;
    }

    get selection(): { name: string, value: any }[] {
        const selectedItems = this.items.filter(item => item.isSelected);
        return selectedItems.map(item => (
            {
                name: item.name,
                value: item.value
            }
        ));
    }

    lazyLoad = (element: HTMLElement) => {
        this.scrollElement = element;
        const availableHeight = element.scrollHeight - element.clientHeight;
        const { scrollTop } = element;
        const percent = (scrollTop / availableHeight) * 100;

        if (percent >= 90) {
            this.addToDom(DISPLAY_ADD);
        }
    };

    search = (searchString: string): void => {
        this.items = this.items.map((item) => {
            if (item.name.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) < 0) {
                return {
                    ...item,
                    hidden: true
                };
            }

            return {
                ...item,
                hidden: false
            };
        });
        this.addToDom(DISPLAY_INIT, true);
    };

    addToDom = (count: number, force: boolean = false) => {
        if (force) {
            this.$dialog.innerHTML = '';
            this.lastDisplayedIndex = -1;
            if (this.scrollElement) {
                this.scrollElement.scrollTop = 0;
            }
        }

        let added: number = 0;
        while (added < count && (this.lastDisplayedIndex < this.items.length - 1)) {
            this.lastDisplayedIndex += 1;
            const item = this.items[this.lastDisplayedIndex];
            if (!item.hidden) {
                const $item = this.getElement(item);
                this.$dialog.appendChild($item);
                added += 1;
            }
        }
    };

    getElement = memorize((item: Item): HTMLElement => {
        const itemId: number = typeof item.id === 'number' ? item.id : -1;
        let icon: ?string = null;
        let image: ?string = null;
        const classes = classNames(
            'select-dialog__item',
            'ChaynsCS-Border-30Pcnt',
            {
                'ChaynsCS-BgColor-20Pcnt': item.isSelected
            }
        );

        if (typeof item.image === 'string') {
            image = `<div class="select-dialog__item__image"><img src="${item.image}" onerror="this.style.display = 'none'" alt="" /></div>`;
        }

        if (item && item.icon && item.icon.name) {
            const rgba = item.icon.color ? argbHexToRgba(item.icon.color) : argbHexToRgba(chaynsInfo.Color);
            const styles = rgba !== null ? `color: rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a});` : '';

            icon = `<div style=${styles} class="select-dialog__item__icon">
                            <span class="fa ${item.icon.name}"></span>
                        </div>`;
        }

        const $item: HTMLElement = htmlToElement(`<div class="${classes}" >
                                    ${image || ''}
                                    ${icon || ''}
                                    <div title="${item.name}">${item.name}</div>
                               </div>`);


        $item.addEventListener('click', () => {
            if (this.multiselect) {
                $item.classList.toggle('ChaynsCS-BgColor-20Pcnt');

                const index = this.items.findIndex(listItem => listItem.id === itemId);
                this.items[index].isSelected = !this.items[index].isSelected;
            } else {
                $item.classList.toggle('ChaynsCS-BgColor-20Pcnt');

                this.items = this.items.map(listItem => (
                    {
                        ...listItem,
                        isSelected: listItem.id === itemId
                    }
                ));
                this.selectCB(this.selection);
            }
        });

        return $item;
    }, item => item.id);
}
