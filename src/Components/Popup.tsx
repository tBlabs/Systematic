import * as React from 'react';
import { Button } from './Button';

interface IProps
{
    title: string;
    onCancel?: () => void;
}

export class Popup extends React.Component<IProps, {}>
{
    render()
    {
        return (
            <div className="popup-background">
                <div className="popup">
                    <div className="title">{this.props.title}</div>
                    <div className="context">{this.props.children}</div>
                    <div className="actions">
                        {this.props.onCancel &&
                            <Button label="CANCEL" onClick={() => this.props.onCancel?.()} />}
                    </div>
                </div>
            </div>
        );
    }
}