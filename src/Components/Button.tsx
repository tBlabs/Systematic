import * as React from 'react';

interface IProps
{
    label: string;
    onClick: () => void;
}

export class Button extends React.Component<IProps, {}>
{
    render()
    {
        return (
            <button className="button2" onClick={()=>this.props.onClick()} >
                {this.props.label}
            </button>
        );
    }
}