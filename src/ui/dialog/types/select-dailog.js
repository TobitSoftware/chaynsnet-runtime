/* @flow */
import type { Config as BaseConfig } from './config';

export type Item={
    id?: number,
    name: string,
    value: any,
    isSelected?: boolean,
    icon?:{
        name: string,
        color?: string,
    },
    hidden?: boolean,
}

export type Config = BaseConfig & {
    multiselect: boolean,
    quickfind: boolean,
    list: Item[],
};

