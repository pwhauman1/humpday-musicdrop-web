import React from "react";
import { FLOW_STATES, IDrop } from '../Constants';
import { InputNumber, Space } from 'antd'

interface IDropsMonthDisplayState {
    state?: FLOW_STATES,
    month: number,
    year: number,
    drops?: IDrop[],
}

export default function DropsMonthDisplay() {
    const now = new Date();
    const initialState: IDropsMonthDisplayState = {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
    }
    const [state, setState] = React.useState<IDropsMonthDisplayState>(initialState);
    const Selectors = () => getSelector(state, setState);
    return (
        <div>
            <h1>Month: {state.month}</h1>
            <h1>Year: {state.year}</h1>
            <Selectors/>
        </div>
    );
}

function getSelector(state: IDropsMonthDisplayState, setState: Function) {
    const setMonth = (value: number | string | null) => {
        const cleanNum = cleanNumberInput(value);
        if (cleanNum === undefined) return;
        setState((previousState: IDropsMonthDisplayState) => {
            const newState = {
                ...previousState,
                month: cleanNum,
            };
            return newState;
        });
    }

    const setYear = (value: number | string | null) => {
        const cleanNum = cleanNumberInput(value);
        if (cleanNum === undefined) return;
        setState((previousState: IDropsMonthDisplayState) => {
            const newState = {
                ...previousState,
                year: cleanNum,
            };
            return newState;
        });
    }

    return (
        <div>
            <Space>
                <InputNumber min={1} max={12} value={state.month} onChange={setMonth} />
                <InputNumber min={1000} max={9999} value={state.year} onChange={setYear} />
            </Space>
        </div>
    )
}

function cleanNumberInput(value: any): number | undefined {
    const num = parseInt(value);
    if(num === NaN) return undefined;
    return num;
}

