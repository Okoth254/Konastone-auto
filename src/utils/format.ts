export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KSH',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace('KSH', 'KSh');
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date));
}
