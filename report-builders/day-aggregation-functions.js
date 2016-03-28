export let sumDayPayments = (dayPayment) => {
    return sumPayments(dayPayment.paymentsCash) +
        sumPayments(dayPayment.payments) +
        (sumPayments(dayPayment.paymentsCertificate) * 0.15); // we get 15% from certificates

}

export let countDayGames = (dayPayment) => {
    return dayPayment.paymentsCash.length + dayPayment.payments.length + dayPayment.paymentsCertificate.length;
}

function sumPayments(paymentsArray) {
    return paymentsArray.reduce(function(prevSum, currentPayment) { return prevSum + currentPayment; }, 0);
}

function aggregateWeekInformation(sortedWeekInfo) {
    let weekDate = sortedWeekInfo[0].date;

    return {
        date: weekDate,
        aggregatedRoomPayments: reduceRoomPayment(sortedWeekInfo)
    };
}