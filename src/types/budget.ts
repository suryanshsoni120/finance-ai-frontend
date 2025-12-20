export interface BudgetDocument {
    _id: string;
    user: string;
    month: number;
    year: number;
    totalBudget: number;
    categoryBudgets: Record<string, number>; // Map of category -> limit
    createdAt: string;
    updatedAt: string;
}

// For the UI, we still need the calculated 'spent'
export interface BudgetUI {
    _id?: string; // Optional since it might be derived
    category: string;
    amount: number; // The limit from the Map
    spent: number; // Calculated from analytics
    color?: string;
}
