import moment from 'moment';

export class Repeater
{
    public static EveryHour(action: () => void, everySecond?: (timeLeft: string) => void)
    {
        const initialCounter = 60*60; // minutes * seconds
        let counter = initialCounter;
        let time = "";

        setInterval(() =>
        {
            counter -= 1;

            if (counter <= 0)
            {
                counter = initialCounter;

                action();
            }

            const timestamp = counter * 1000;
            time = moment(timestamp).format("mm:ss");

            everySecond?.(time);

        }, 1000);
    }
}