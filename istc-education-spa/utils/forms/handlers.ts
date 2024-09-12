export const handleIntInput = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, '');
};