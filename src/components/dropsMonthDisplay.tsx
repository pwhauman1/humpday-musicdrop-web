import React, { useEffect } from "react";
import { FLOW_STATES, IDrop } from '../Constants';
import { InputNumber, Space, Typography } from 'antd'
import DropCard from "./dropCard";
import { getDrops } from "../modules/axiosModule";
import FlowWrapper, { IFlowWrapperProps } from "./flowWrapper";

const { Text } = Typography;

interface IDropsMonthDisplayState {
    state?: FLOW_STATES,
    month: number,
    year: number,
    drops?: IDrop[],
    flow: FLOW_STATES,
}

export default function DropsMonthDisplay() {
    const now = new Date();
    const initialState: IDropsMonthDisplayState = {
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        flow: FLOW_STATES.LOADING,
    }
    const [state, setState] = React.useState<IDropsMonthDisplayState>(initialState);

    // If month or year change, set flow to loading and call the 
    // backend for the new drops
    useEffect(() => {
        setState((previousState: IDropsMonthDisplayState) => {
            const newState = {
                ...previousState,
                drops: undefined,
                flow: FLOW_STATES.LOADING,
            };
            return newState;
        });
        getDropsFromDdb(state.month, state.year, setState);

    }, [state.month, state.year]);

    const Selectors = () => getSelector(state, setState);
    const DropCards = () => getDropCards(state.drops, state.flow);
    return (
        <div>
            <Selectors />
            <Space wrap align="start">
                <DropCards />
            </Space>
        </div>
    );
}

// Function doesn't return anything because we change the view with setState
async function getDropsFromDdb(month: number, year: number, setState: Function) {
    try {
        const drops = await getDrops(month, year)
        // Once we have the drops, mark our flow as ready
        setState((previousState: IDropsMonthDisplayState) => {
            const newState = {
                ...previousState,
                drops: drops,
                flow: FLOW_STATES.READY,
            };
            return newState;
        });
    } catch {
        console.error('Failed to get Drops from DDB');
        // If we fail to retrieve drops, mark flow state as an error
        setState((previousState: IDropsMonthDisplayState) => {
            const newState = {
                ...previousState,
                drops: undefined,
                flow: FLOW_STATES.ERROR,
            };
            return newState;
        });
    }

}

// convert IDrop[] into a proper FlowWrapper
function getDropCards(drops: IDrop[] | undefined, flow: FLOW_STATES): JSX.Element {
    const dropCards: JSX.Element[] = [];
    if (drops) {
        drops.forEach(drop => {
            dropCards.push(<DropCard {...drop} key={drop.sendDateKey} />)
        });
    }
    const toRender = dropCards.length ? <div>{dropCards}</div> : <p>No drops found</p>;
    const errorMessage = <p><Text type="danger">Oops, couldn't load cards</Text></p>
    const flowWrapperProps: IFlowWrapperProps = {
        flow,
        readyChildren: toRender,
        errorChildren: errorMessage,
    }
    return <FlowWrapper {...flowWrapperProps} />
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
                Month:
                <InputNumber min={1} max={12} value={state.month} onChange={setMonth} />
                Year:
                <InputNumber min={1000} max={9999} value={state.year} onChange={setYear} />
            </Space>
        </div>
    )
}

function cleanNumberInput(value: any): number | undefined {
    const num = parseInt(value);
    if (isNaN(num)) return undefined;
    return num;
}

