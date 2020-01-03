import * as React from 'react';
import moment from 'moment';
import { Task } from '../Models/Task';
import { Button } from './Button';

interface IProps
{
    task: Task;
    onSave(task: Task): void;
}

interface IState
{
    title: string;
    interval: string;
    deadline: string;
}

export class TaskEdit extends React.Component<IProps, IState>
{
    constructor(props: any)
    {
        super(props);

        this.state = {
            title: this.props.task.Title || "",
            interval: this.props.task.Interval || "1 M",
            deadline: this.props.task.Deadline || moment().format("D-M-Y")
        }
    }

    render()
    {
        return (
            <div className="form">
                <div className="row">
                    <div className="label">Title:</div> 
                    <input type="text" placeholder="ex. Taxes" value={this.state.title} onChange={x => this.setState({ title: x.target.value })} />
                </div>
                <div className="row">
                    <div className="label">Repetition:</div> 
                    <input type="text" placeholder="{number} M|Y" value={this.state.interval} onChange={x => this.setState({ interval: x.target.value })} />
                </div>
                <div className="row">
                    <div className="label">Deadline:</div> 
                    <input type="text" placeholder="DD-MM-YYYY" value={this.state.deadline} onChange={x => this.setState({ deadline: x.target.value })} />
                </div>
                <div className="actions">
                    <Button label="SAVE" onClick={()=>this.SaveButton_Click()} />
                </div>
            </div>
        );
    }

    SaveButton_Click(): void
    {
        const task = this.props.task;
        task.Title = this.state.title.trim();
        if (task.Title.length === 0) 
        {
            alert("Task can not be empty");
            return;
        }
        task.Interval = this.state.interval.trim();
        task.Deadline = this.state.deadline.trim();

        this.props.onSave(task);
    }
}