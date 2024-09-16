export const convertDateToMMDDYYYY = (date: string): string => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
}

export const convertTo12HourFormat = (time: string): string => {
    let [hours, minutes, seconds] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return formattedTime;
};