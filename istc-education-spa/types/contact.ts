interface Contact {
    contactId: number;
    userId: number;
    email: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
}