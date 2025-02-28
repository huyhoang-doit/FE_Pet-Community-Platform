export function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB').format(date);
}
