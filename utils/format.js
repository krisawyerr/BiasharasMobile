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

export function formatDollarAmount(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");

    if (Math.abs(number) >= 1e11) {
        return `${number < 0 ? '-$' : '$'}${Math.abs(number).toExponential(0)}`;
    }

    let newNumber;
    let formattedNumber = "";

    if (Math.abs(number) >= 1e9) {
        newNumber = (number / 1e9).toString();
        formattedNumber = 'B';
    } else {
        newNumber = Math.abs(number).toString(); 
    }

    const isLessThanTen = Math.abs(parseFloat(newNumber)) < 10;
    newNumber = isLessThanTen ? newNumber.slice(0, newNumber.indexOf('.') + 2) : newNumber.split('.')[0];

    return `${number < 0 ? '-$' : '$'}${Math.abs(newNumber).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${formattedNumber}`;
}

export function formatDollarAmountShorthand(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");

    if (Math.abs(number) >= 1e11) {
        return `${number < 0 ? '-$' : '$'}${Math.abs(number).toExponential(0)}`;
    }

    let newNumber;
    let formattedNumber = "";

    if (Math.abs(number) >= 1e9) {
        newNumber = (number / 1e9).toString();
        formattedNumber = 'B';
    } else if (Math.abs(number) >= 1e6) {
        newNumber = (number / 1e6).toString();
        formattedNumber = 'M';
    } else if (Math.abs(number) >= 1e3) {
        newNumber = (number / 1e3).toString();
        formattedNumber = 'K';
    } else {
        newNumber = Math.abs(number).toString(); 
    }

    const isLessThanTen = Math.abs(parseFloat(newNumber)) < 10;
    newNumber = isLessThanTen ? newNumber.slice(0, newNumber.indexOf('.') + 2) : newNumber.split('.')[0];

    return `${number < 0 ? '-$' : '$'}${Math.abs(newNumber)}${formattedNumber}`;
}

export function formatPercent(amount) {
    const number = parseFloat(amount*100);
    if (isNaN(number)) throw new Error("Invalid input: must be a valid number");

    if (Math.abs(number) >= 1e11) {
        return `${number.toExponential(0)}%`;
    }

    let newNumber;
    let formattedNumber = "";

    if (Math.abs(number) >= 1e9) {
        newNumber = (number / 1e9).toString();
        formattedNumber = 'B';
    } else if (Math.abs(number) >= 1e6) {
        newNumber = (number / 1e6).toString();
        formattedNumber = 'M';
    } else if (Math.abs(number) >= 1e3) {
        newNumber = (number / 1e3).toString();
        formattedNumber = 'K';
    } else {
        newNumber = number.toString(); 
    }

    const isLessThanTen = Math.abs(parseFloat(newNumber)) < 10;
    newNumber = isLessThanTen ? newNumber.slice(0, newNumber.indexOf('.') + 2) : newNumber.split('.')[0];

    return `${newNumber}${formattedNumber}%`;
}

export function formatDateString(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
