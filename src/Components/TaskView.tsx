import * as React from 'react';
import "./../HtmlStyles/Task2.css";
import { ProgressBar } from './ProgressBar';
import { Task } from '../Models/Task';
import { EtaCalculator as EtaCalculator } from '../Services/EtaCalculator';
import { Button } from './Button';
import { LazyInject } from '../IoC/IoC';
import { Types } from '../IoC/Types';
import { Eta } from '../Models/Eta';

interface IProps
{
    time: string;
    task: Task;
    onTaskDoneClick: () => void;
    onEditClick: () => void;
}

export class TaskView extends React.Component<IProps, {}>
{
    @LazyInject(Types.EtaCalculator) private _eta: EtaCalculator;

    render()
    {
        const eta: Eta = this._eta.Calculate(this.props.time, this.props.task);
        const label = `${this.props.task.Title} (${this.props.task.Interval})`;
        
        return (
            <div className="box">
                <div className="progress-bar">
                    <ProgressBar progress={eta.Progress} normal={!eta.IsBeforeDeadline} />
                </div>
                <div className="title">{label}</div>
                <div className="time">{eta.Time}</div>
                <div className="buttons">
                    <Button label="+" onClick={() => this.props.onTaskDoneClick()} />
                    <Button label="::" onClick={() => this.props.onEditClick()} />
                </div>
            </div>
        );
    }
}