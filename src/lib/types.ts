export type Student = {
  id: string;
  fullName: string;
  grade: number;
  enrollmentDate: string;
  balance: number;
  monthlyFee: number;
  isArchived: boolean;
  avatarUrl: string;
};

export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  note: string;
  date: string;
  balanceAfter: number;
};

export type Position = {
  id: string;
  name: string;
  type: 'hourly' | 'monthly';
  rate: number;
};

export type Staff = {
  id: string;
  fullName: string;
  position: Position;
  avatarUrl: string;
  hoursWorked?: { [day: string]: number }; // For hourly
  salary?: number; // For monthly
};

export type Expense = {
  id: string;
  date: string;
  amount: number;
  description: string;
};

export type Test = {
  id: string;
  month: string;
  grade: number;
};

export type TestResult = {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  score: number;
};
