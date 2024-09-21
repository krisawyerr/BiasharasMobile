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
    if (parts.length > 2) {
        cleaned = `${parts[0]}.${parts.slice(1).join('')}`; 
    }

    if (parts.length === 2) {
        const decimalPart = parts[1].slice(0, 2); 
        cleaned = `${parts[0]}.${decimalPart}`;
    }

    if (cleaned.charAt(0) === '-') {
        cleaned = '-' + cleaned.replace(/-/g, '');
    }

    return cleaned.length > 10 ? cleaned.slice(0, 10) : cleaned;
}