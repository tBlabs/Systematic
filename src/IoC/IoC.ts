import { Container } from "inversify";
import { Types } from './Types';
import "reflect-metadata";
import getDecorators from "inversify-inject-decorators";
import { TasksRepo } from '../Services/TasksRepo';
import { EtaCalculator } from "../Services/EtaCalculator";

const IoC = new Container();

IoC.bind(Types.Storage).to(TasksRepo).inSingletonScope();
IoC.bind(Types.EtaCalculator).to(EtaCalculator).inTransientScope();

const LazyInject = getDecorators(IoC).lazyInject;

export { IoC, LazyInject };