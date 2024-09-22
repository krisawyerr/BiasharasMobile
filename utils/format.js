export function formatDate(input) {
    const cleaned = input.replace(/\D/g, '').slice(0, 8);
    const day = cleaned.slice(6); 
    const month = cleaned.slice(4, 6); 
    const year = cleaned.slice(0, 4); 

    return `${year}${month.length > 0 ? '-' + month : ''}${day.length > 0 ? '-' + day : ''}`.trim();
}

export function formatPrice(input) {
    let cleaned = input.replace(/[^0-9.-]/g, ''); 

    const parts = cleaned.split('.');
    if (parts.length > 2) cleaned = `${parts[0]}.${parts.slice(1).join('')}`; 

    if (parts.length === 2) {
        const decimalPart = parts[1].slice(0, 2); 
        cleaned = `${parts[0]}.${decimalPart}`;
    }

    if (cleaned.charAt(0) === '-') cleaned = '-' + cleaned.replace(/-/g, '');

    return cleaned.length > 10 ? cleaned.slice(0, 10) : cleaned;
}

export function formatPercent(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");

    return `${parseInt(number * 100)}%`;
}

export function formatDollarAmount(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");

    const formattedNumber = Math.abs(number).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${number < 0 ? '-$' : '$'}${formattedNumber}`;
}

export function formatDollarAmountShorthand(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");
  
    let newNumber;
    let formattedNumber = "";
  
    if (Math.abs(number) >= 1e9) {
        newNumber = (number / 1e9).toFixed(Math.abs(number / 1e9) < 10 ? 1 : 0);
        formattedNumber ='B';
    } else if (Math.abs(number) >= 1e6) {
        newNumber = (number / 1e6).toFixed(Math.abs(number / 1e6) < 10 ? 1 : 0);
        formattedNumber ='M';
    } else if (Math.abs(number) >= 1e3) {
        newNumber = (number / 1e3).toFixed(Math.abs(number / 1e3) < 10 ? 1 : 0);
        formattedNumber ='K';
    } else {
        newNumber = Math.round(number).toString();
    }
  
    return `${newNumber < 0 ? '-$' : '$'}${Math.abs(newNumber)}${formattedNumber}`;
}