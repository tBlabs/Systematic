import { Task } from '../Models/Task';
import moment, { Moment, unitOfTime } from 'moment';
import { injectable } from 'inversify';
import { Eta } from '../Models/Eta';

@injectable()
export class EtaCalculator
{
  Calculate(currentDate: string, task: Task): Eta
  {
    const view = new Eta();

    const now = moment(currentDate, "DD-MM-YYYY");
    const target: Moment = moment(task.Deadline, "DD-MM-YYYY");
    const [amount, unit] = task.Interval.split(' ');
    const rangeStart = target.clone().subtract(+amount, unit as unitOfTime.Base);
    const rangeStartFormatted: Moment = moment(rangeStart.format("DD-MM-YYYY"), "DD-MM-YYYY"); // bez tej podwójnej konwersji nie działa
    const range = target.diff(rangeStartFormatted, 'days');
    const daysLeft = target.diff(now, 'days');
    const progress = (daysLeft / range) * 100;

    view.IsBeforeDeadline = daysLeft > 0;
    if (daysLeft === 0) view.Time = "DEADLINE IS NOW! " + task.Deadline;
    else
      view.Time = view.IsBeforeDeadline ? daysLeft + " days left till " + task.Deadline : -daysLeft + " days after deadline " + task.Deadline;

    view.Progress = Math.abs(progress);

    return view;
  }
}
