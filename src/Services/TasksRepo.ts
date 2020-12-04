import { injectable } from "inversify";
import { Task } from "../Models/Task";
import moment from 'moment';

@injectable()
export class TasksRepo
{
    private storageAddr = "";
    private tasks: Task[] = [];

    public get Tasks()
    {
        return this.tasks
            .sort((a, b) =>
            {
                return moment(a.Deadline, 'D-M-Y')
                    .isAfter(moment(b.Deadline, 'D-M-Y')) ? 1 : -1;
            });
    }

    public Init(storageId: string): void
    {
        this.storageAddr = process.env.STORAGE! + "/" + storageId;
    }
    
    public async Add(task: Task)
    {
        this.tasks.push(task);
        this.Push();
    }

    public async Update(task: Task)
    {
        const index = this.tasks.findIndex(x => x.Id === task.Id);
        if (index < 0) throw new Error("Not possible, index = " + index);

        this.tasks[index] = task;

        this.Push();
    }

    public async Delete(task: Task)
    {
        const index = this.tasks.findIndex(x => x.Id === task.Id);
        if (index < 0) throw new Error("Not possible, index = " + index);

        this.tasks.splice(index, 1);

        this.Push();
    }

    public async Pull(): Promise<void>
    {
        try 
        {
            const response = await fetch(this.storageAddr);
            this.tasks = await response.json();
        } 
        catch (error) 
        {
            console.warn("Problem with data fetch or parse: " + error.message);
            console.warn("Current storage will be overridden!");
        }
    }

    public async Push()
    {
        await fetch(this.storageAddr, { method: "POST", body: JSON.stringify(this.tasks) });
    }
}