import { guid } from "../types/guid";
import * as Guid from "uuid";

export class Task
{
  Id: guid;
  Title: string;
  Interval: string;
  Deadline: string;

  constructor()
  {
    this.Id = Guid.v4();
  }
}
