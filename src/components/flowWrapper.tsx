import { Spin } from "antd";
import { FLOW_STATES } from "../Constants";

export interface IFlowWrapperProps {
    flow: FLOW_STATES,
    readyChildren: JSX.Element,
    errorChildren: JSX.Element,
}

export default function FlowWrapper(props: IFlowWrapperProps) {
    switch (props.flow) {
        case FLOW_STATES.LOADING:
            return <Spin />;
        case FLOW_STATES.ERROR:
            return props.errorChildren;
        case FLOW_STATES.READY:
            return props.readyChildren;
        default:
            return props.errorChildren;
    }
}