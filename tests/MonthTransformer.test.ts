// import { Eta } from '../src/Models/Eta';
// import { Task } from "../src/Models/Task";
// import { MonthTransformer } from "../src/Components/MonthTransformer";

// test(MonthTransformer.name, () =>
// {
//     // Given
//     const now = new Date(2019, 12, 25);
//     const task: Task = { Title: "Task1", Interval: "M", Deadline: new Date(2020, 1, 10) };
    
//     const sut = new MonthTransformer(now);

//     // When
//     const view: Eta = sut.Transform(task);

//     // Then
//     expect(view.Title).toBe("Task1");
//     expect(view.IsBeforeDeadline).toBeTruthy();
//     expect(view.Progress).toBeCloseTo(16 / 31);
//     expect(view.Time).toBe("16 days left");
// });