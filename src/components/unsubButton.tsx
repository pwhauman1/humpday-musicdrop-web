import { Button, Form, Input } from "antd";
import Text from "antd/lib/typography/Text";
import { useState } from "react";
import { EMAIL_REG_EXP, FLOW_STATES } from '../Constants'
import { deleteRecipient } from "../modules/axiosModule";
import FlowWrapper, { IFlowWrapperProps } from "./flowWrapper";

let semiGlobalSetStatus: Function;

interface IUnsubscribeStatus {
    flowState: FLOW_STATES,
    message?: string,
}

export default function UnsubButton() {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        const email = values.email;
        semiGlobalSetStatus({flowState: FLOW_STATES.LOADING});
        deleteRecipient(email).then(res => {
            semiGlobalSetStatus({
                flowState: FLOW_STATES.READY,
                message: `Successfully unsubscribed ${email}`
            });
        }).catch(e => {
            console.error(e.message);
            semiGlobalSetStatus({
                flowState: FLOW_STATES.ERROR,
                message: `Failed to unsubscribed ${email}. Email humpday.musicdrop@gmail.com directly if you still recieve emails`
            });
        })
    };
    return (
        <div>
            <Form form={form} layout='inline' onFinish={onFinish}>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input placeholder="e-mail" />
                </Form.Item>
                <Form.Item shouldUpdate>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !isValidEmail(form.getFieldInstance('email'))
                            }
                        >
                            Unsubscribe
                        </Button>
                    )}
                </Form.Item>
            </Form>
            <Status />
        </div>
    );
}

function Status() {
    const [status, setStatus] = useState<IUnsubscribeStatus>({
        flowState: FLOW_STATES.NONE
    });
    semiGlobalSetStatus = setStatus;
    const readyChildren = <Text type='success'>{status.message}</Text>
    const errorChildren = <Text type='danger'>{status.message}</Text>
    const flowWrapperProps: IFlowWrapperProps = {
        flow: status.flowState,
        readyChildren: readyChildren,
        errorChildren: errorChildren,
    }
    return <FlowWrapper {...flowWrapperProps}/>

}

function isValidEmail(emailInput: any): boolean {
    if(!emailInput) return false;
    const email = emailInput.state.value;
    if(!email || typeof email != 'string') return false;
    else return !!email.match(EMAIL_REG_EXP)?.length
}