function erlangB(E, C) {
    let numerator = Math.pow(E, C) / factorial(C);
    let denominator = 0;
    for (let k = 0; k <= C; k++) {
        denominator += Math.pow(E, k) / factorial(k);
    }
    if (denominator === 0) return 1; 
    return numerator / denominator;
}

function factorial(n) {
    
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function findChannels(E, B) {
    if (E <= 0 || B <= 0) return 0;
    let C = Math.ceil(E); 
    if (C === 0) C = 1;
    
    while (true) {
        let blockingProbability = erlangB(E, C);
        if (blockingProbability <= B) {
            return C;
        }
        C++;
        
        if (C > 10000) return C; 
    }
}