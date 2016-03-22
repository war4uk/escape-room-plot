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
                receivedWeekEntries.push(prevValue.currentWeek.entries)
            } else {
                curWeekEntries = [...prevValue.currentWeek.entries, dayPayingInfo];

            }

            return { currentWeek: { id: weekNumber, entries: curWeekEntries }, weekEntries: receivedWeekEntries };
        },
        { currentWeek: { id: 0, entries: [] }, weekEntries: null }
    );

    let result = [...weekSplitEntries.weekEntries, weekSplitEntries.currentWeek.entries];
    result.splice(0, 1);
    
    return result;
};