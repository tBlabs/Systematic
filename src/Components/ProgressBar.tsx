import * as React from 'react';

export interface IProps
{
    progress: number;
    normal: boolean;
}

export class ProgressBar extends React.Component<IProps, {}>
{
    render()
    {
        const p = this.props.progress > 100 ? 100 : this.props.progress;

        if (p===0 && this.props.normal)
            return (<div className="progress-background" style={{backgroundColor: "#ddd"}}>
                <div className="progress" style={{ width: p + "%", backgroundColor: "#ddd" }}>
                    {/* {this.props.progress} */}
                </div>
            </div>);

        if (p===100 && this.props.normal)
            return (<div className="progress-background" style={{backgroundColor: "#222"}}>
                <div className="progress" style={{ width: p + "%", backgroundColor: "maroon" }}>
                    {/* {this.props.progress} */}
                </div>
            </div>);

        if (this.props.normal)
        {
            return (<div className="progress-background" style={{backgroundColor: "#222"}}>
                <div className="progress" style={{ width: p + "%", backgroundColor: "orange" }}>
                    {/* {this.props.progress} */}
                </div>
            </div>);
        }

        const progress = 100 - p;

        return (<div className="progress-background">
            <div className="progress" style={{ width: progress + "%" }}>
                {/* {this.props.progress} */}
            </div>
        </div>);
    }
}
