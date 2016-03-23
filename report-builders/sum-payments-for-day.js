export default (dayPayment) => {
    return sumPayments(dayPayment.paymentsCash) +
        sumPayments(dayPayment.payments) +
        sumPayments(dayPayment.paymentsCertificate);

}

function sumPayments(paymentsArray) {
    return paymentsArray.reduce(function(prevSum, currentPayment) { return prevSum + currentPayment; }, 0);
}