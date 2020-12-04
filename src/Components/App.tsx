import * as React from 'react';
import { Types } from '../IoC/Types';
import { LazyInject } from '../IoC/IoC';
import moment, { Moment, unitOfTime } from 'moment';
import { TaskView } from './TaskView';
import { Task } from '../Models/Task';
import { TaskEdit } from './TaskEdit';
import './../HtmlStyles/Popup';
import { Popup } from './Popup';
import { Button } from './Button';
import * as Guid from 'uuid';
import { TasksRepo } from '../Services/TasksRepo';
import './../HtmlStyles/Tasks';
import { Auth } from './Auth';
import { AuthData } from '../DTO/AuthData';
import { Repeater } from '../Services/Repeater';

interface IState
{
  date: string;
  tasks: Task[];
  addTaskPopupVisibility: boolean;
  openEditPopup: boolean;
  isAuthorized: boolean;
  timeToRefresh: string;
}

export class App extends React.Component<{}, IState>
{
  @LazyInject(Types.Storage) private _repo: TasksRepo;

  state = {
    date: moment().format("D-M-Y"),
    addTaskPopupVisibility: false,
    openEditPopup: false,
    tasks: [],
    isAuthorized: false,
    timeToRefresh: "..."
  };

  private taskToEdit: Task;

  componentDidMount()
  {
    Repeater.EveryHour(async () =>
    {
      await this.Load();
    },
      (timeToRefresh) => this.setState({ timeToRefresh: timeToRefresh }));
  }

  private async Load(): Promise<void>
  {
    await this._repo.Pull();

    this.setState({
      tasks: this._repo.Tasks,
      date: moment().format("D-M-Y")
    });
  }

  render()
  {
    if (!this.state.isAuthorized) 
    {
      return <Popup title="Login">
        <Auth<AuthData> onLoginSuccess={async (data) => await this.OnLoginSuccess(data)} />
      </Popup>;
    }

   // if (this.state.tasks.length === 0) return <p>Loading...</p>

    return (
      <div className="tasks">
        <div className="clock">{this.state.date}</div>
        {/* <div className="clock-big">{this.state.date}</div> */}
        <a style={{ float: "right" }} onClick={() => this.Logout()}>LOGOUT</a>

        {this.state.tasks.length === 0 ? <p style={{color: "white"}}>List is empty</p> : this.state.tasks.map((task: Task) =>
          <TaskView
            key={Guid.v4()}
            time={this.state.date}
            task={task}
            onTaskDoneClick={async () => await this.MoveDeadline(task)}
            onEditClick={() => this.OpenEditTaskPopup(task)} />
        )}

        <div className="actions" style={{ marginTop: "18px" }}>
          <Button label="[ + ]"
            onClick={() => this.ToggleAddTaskPopupVisibility()} />
        </div>

        {this.state.addTaskPopupVisibility && this.AddTaskPopup()}

        {this.state.openEditPopup && this.EditTaskPopup()}

        <br /><br /><br /><br />
        <a onClick={() => this.Add7Days()}>ADD 7 DAYS</a> | <a onClick={() => this.StartDemo()}>DEMO</a>
        <div style={{ float: "right", color: "#444" }}>REFRESH IN {this.state.timeToRefresh}</div>
      </div>
    );
  }

  private Logout(): void
  {
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('password');

    this.setState({ isAuthorized: false });
  }

  private async OnLoginSuccess(data: AuthData): Promise<void>
  {
    this.setState({ isAuthorized: true });

    this._repo.Init(data.TasksStorage);

    await this.Load();

    setInterval(async () =>
    {
      console.log('Refreshing...');
      await this.Load();
      console.log("Refreshed.");
    },
      1000 * 60 * 60); // 1h
  }

  private Add7Days()
  {
    const now = moment(this.state.date, "D-M-Y");
    const next = now.add(7, "day").format("D-M-Y");
    this.setState({ date: next });
  }

  private StartDemo()
  {
    setInterval(() =>
    {
      const now = moment(this.state.date, "D-M-Y");
      const next = now.add(1, "day").format("D-M-Y");
      this.setState({ date: next });
    }, 500);
  }

  private OpenEditTaskPopup(task: Task): void
  {
    this.taskToEdit = task;
    this.setState({ openEditPopup: true });
  }

  private async MoveDeadline(task: Task): Promise<void>
  {
    // Move deadline for next cycle
    const deadline = moment(task.Deadline, "D-M-Y");
    const [val, desc] = task.Interval.split(' ');
    task.Deadline = deadline.add(val, desc as unitOfTime.Base).format("D-M-Y");
    this.setState({ tasks: this.state.tasks });

    await this._repo.Update(task);
  }

  private EditTaskPopup(): React.ReactNode
  {
    const CloseEditTaskPopup = () => this.setState({ openEditPopup: false });

    return <Popup title="Edit Task"
      onCancel={() => CloseEditTaskPopup()}>
      <TaskEdit task={this.taskToEdit} onSave={async (task) =>
      {
        await this.UpdateTask(task);
        CloseEditTaskPopup();
      }} />
      <Button label="DELETE" onClick={async () =>
      {
        await this._repo.Delete(this.taskToEdit);
        CloseEditTaskPopup();
      }} />
    </Popup>;
  }

  private AddTaskPopup(): React.ReactNode
  {
    const CloseAddTaskPopup = () => this.setState({ addTaskPopupVisibility: false });

    return <Popup title="➕ Add new Task"
      onCancel={() => CloseAddTaskPopup()}>
      <TaskEdit task={new Task()} onSave={async (task) =>
      {
        await this.AddEntry(task);
        CloseAddTaskPopup();
      }} />
    </Popup>;
  }

  private ToggleAddTaskPopupVisibility(): void
  {
    return this.setState({ addTaskPopupVisibility: !this.state.addTaskPopupVisibility });
  }

  async UpdateTask(task: Task): Promise<void>
  {
    await this._repo.Update(task);

    this.setState({ tasks: this._repo.Tasks });
  }

  async AddEntry(task: Task): Promise<void>
  {
    await this._repo.Add(task);

    this.setState({ tasks: this._repo.Tasks });
  }
}