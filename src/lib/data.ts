import { Student, Staff, Position, Expense, Test, TestResult, Attendance } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const POSITIONS: Position[] = [
  { id: 'pos1', name: 'Math Teacher', type: 'monthly', rate: 3000000 },
  { id: 'pos2', name: 'English Teacher', type: 'monthly', rate: 2800000 },
  { id: 'pos3', name: 'Science Teacher', type: 'hourly', rate: 45000 },
  { id: 'pos4', name: 'Administrator', type: 'monthly', rate: 3500000 },
];

export let STAFF: Staff[] = [
  {
    id: 'staff1',
    fullName: 'John Doe',
    position: POSITIONS[0],
    avatarUrl: getImage('staff1'),
  },
  {
    id: 'staff2',
    fullName: 'Jane Smith',
    position: POSITIONS[2],
    avatarUrl: getImage('staff2'),
  },
    {
    id: 'staff3',
    fullName: 'Peter Jones',
    position: POSITIONS[3],
    avatarUrl: getImage('staff3'),
  },
];

export let STUDENTS: Student[] = [
  {
    id: 'stu1',
    fullName: 'Alice Johnson',
    grade: 5,
    enrollmentDate: '2023-09-01',
    balance: -150000,
    monthlyFee: 300000,
    isArchived: false,
    avatarUrl: getImage('student1'),
    paymentType: 'monthly',
  },
  {
    id: 'stu2',
    fullName: 'Bob Williams',
    grade: 7,
    enrollmentDate: '2023-08-15',
    balance: 50000,
    monthlyFee: 350000,
    isArchived: false,
    avatarUrl: getImage('student2'),
    paymentType: 'anniversary',
  },
  {
    id: 'stu3',
    fullName: 'Charlie Brown',
    grade: 5,
    enrollmentDate: '2023-09-01',
    balance: -300000,
    monthlyFee: 300000,
    isArchived: false,
    avatarUrl: getImage('student3'),
    paymentType: 'monthly',
  },
  {
    id: 'stu4',
    fullName: 'Diana Miller',
    grade: 8,
    enrollmentDate: '2023-09-05',
    balance: 0,
    monthlyFee: 400000,
    isArchived: false,
    avatarUrl: getImage('student4'),
    paymentType: 'monthly',
  },
  {
    id: 'stu5',
    fullName: 'Ethan Davis',
    grade: 7,
    enrollmentDate: '2023-08-20',
    balance: -700000,
    monthlyFee: 350000,
    isArchived: false,
    avatarUrl: getImage('student5'),
    paymentType: 'anniversary',
  },
  {
    id: 'stu6',
    fullName: 'Fiona Garcia',
    grade: 9,
    enrollmentDate: '2022-09-01',
    balance: 100000,
    monthlyFee: 450000,
    isArchived: true,
    avatarUrl: getImage('student6'),
    paymentType: 'monthly',
  },
   {
    id: 'stu7',
    fullName: 'George Clark',
    grade: 5,
    enrollmentDate: '2023-09-02',
    balance: 0,
    monthlyFee: 300000,
    isArchived: false,
    avatarUrl: getImage('student7'),
    paymentType: 'monthly',
  },
  {
    id: 'stu8',
    fullName: 'Hannah Lewis',
    grade: 7,
    enrollmentDate: '2023-09-01',
    balance: -50000,
    monthlyFee: 350000,
    isArchived: false,
    avatarUrl: getImage('student8'),
    paymentType: 'anniversary',
  }
];

export const EXPENSES: Expense[] = [
    { id: 'exp1', date: '2024-05-01', amount: 500000, description: 'Office Supplies' },
    { id: 'exp2', date: '2024-05-05', amount: 1200000, description: 'Electricity Bill' },
    { id: 'exp3', date: '2024-05-10', amount: 300000, description: 'Internet Bill' },
    { id: 'exp4', date: '2024-04-28', amount: 800000, description: 'New Chairs' },
    { id: 'exp5', date: '2024-04-15', amount: 1150000, description: 'Water Bill' },
];

export const TESTS: Test[] = [];
export const TEST_RESULTS: TestResult[] = [];
export const ATTENDANCE: Attendance[] = [
    // Staff 1 (Monthly) - gets paid fixed salary if they worked
    { id: 'att1', staffId: 'staff1', date: '2024-06-03', hours: 8 },
    { id: 'att2', staffId: 'staff1', date: '2024-06-04', hours: 8 },
    { id: 'att3', staffId: 'staff1', date: '2024-06-05', hours: 8 },
    { id: 'att4', staffId: 'staff1', date: '2024-06-06', hours: 8 },
    { id: 'att5', staffId: 'staff1', date: '2024-06-07', hours: 8 },
    
    // Staff 2 (Hourly)
    { id: 'att6', staffId: 'staff2', date: '2024-06-03', hours: 4 },
    { id: 'att7', staffId: 'staff2', date: '2024-06-04', hours: 4 },
    { id: 'att8', staffId: 'staff2', date: '2024-06-05', hours: 4 },
    { id: 'att9', staffId: 'staff2', date: '2024-06-06', hours: 4 },
    { id: 'att10', staffId: 'staff2', date: '2024-06-07', hours: 4 },
    { id: 'att11', staffId: 'staff2', date: '2024-06-10', hours: 5 },
    { id: 'att12', staffId: 'staff2', date: '2024-06-11', hours: 3 },
];
