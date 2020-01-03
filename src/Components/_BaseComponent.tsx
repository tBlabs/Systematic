import * as React from 'react';

interface IProps
{

}

interface IState
{

}

export class BaseComponent extends React.Component<IProps, IState>
{
    constructor(props: any)
    {
        super(props);

    }

    componentDidMount()
    {

    }

    render()
    {
        return (
            <div>

            </div>
        );
    }
}