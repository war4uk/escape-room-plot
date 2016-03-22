import moment from 'moment';

export default (sortedPayingInfos) => {
    let weekSplitEntries = sortedPayingInfos.reduce(
        (prevValue, dayPayingInfo, index) => {
            let weekNumber = dayPayingInfo.date.week();

            let curWeekEntries;
            let receivedWeekEntries = prevValue.weekEntries || [];
            if (weekNumber != prevValue.currentWeek.id) {
                // start new week entry
                curWeekEntries = [dayPayingInfo];
                // save finished entries 
                if (prevValue.currentWeek.entries) { // it should be null on first iteration
                    receivedWeekEntries.push(prevValue.currentWeek.entries)
                }
            } else {
                // we are inside same week it was on prev step
                curWeekEntries = [...prevValue.currentWeek.entries, dayPayingInfo];
            }

            return { currentWeek: { id: weekNumber, entries: curWeekEntries }, weekEntries: receivedWeekEntries };
        },
        { currentWeek: { id: 0, entries: null }, weekEntries: null }
    );

    return [...weekSplitEntries.weekEntries, weekSplitEntries.currentWeek.entries];
};