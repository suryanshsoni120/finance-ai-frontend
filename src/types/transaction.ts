export interface Transaction {
    _id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring?: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}
