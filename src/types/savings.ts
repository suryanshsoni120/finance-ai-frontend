export interface SavingsGoal {
    _id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
}