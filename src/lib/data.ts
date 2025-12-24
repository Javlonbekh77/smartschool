import { Student, Staff, Position, Expense } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const POSITIONS: Position[] = [
  { id: 'pos1', name: 'Math Teacher', type: 'monthly', rate: 3000 },
  { id: 'pos2', name: 'English Teacher', type: 'monthly', rate: 2800 },
  { id: 'pos3', name: 'Science Teacher', type: 'hourly', rate: 45 },
  { id: 'pos4', name: 'Administrator', type: 'monthly', rate: 3500 },
];

export const STAFF: Staff[] = [
  {
    id: 'staff1',
    fullName: 'John Doe',
    position: POSITIONS[0],
    avatarUrl: getImage('staff1'),
    salary: 3000,
  },
  {
    id: 'staff2',
    fullName: 'Jane Smith',
    position: POSITIONS[2],
    avatarUrl: getImage('staff2'),
    hoursWorked: { Mon: 4, Tue: 4, Wed: 4, Thu: 4, Fri: 4 },
  },
    {
    id: 'staff3',
    fullName: 'Peter Jones',
    position: POSITIONS[3],
    avatarUrl: getImage('staff3'),
    salary: 3500,
  },
];

export const STUDENTS: Student[] = [
  {
    id: 'stu1',
    fullName: 'Alice Johnson',
    grade: 5,
    dateOfBirth: '2013-04-12',
    balance: -150,
    monthlyFee: 300,
    isArchived: false,
    avatarUrl: getImage('student1'),
  },
  {
    id: 'stu2',
    fullName: 'Bob Williams',
    grade: 7,
    dateOfBirth: '2011-08-22',
    balance: 50,
    monthlyFee: 350,
    isArchived: false,
    avatarUrl: getImage('student2'),
  },
  {
    id: 'stu3',
    fullName: 'Charlie Brown',
    grade: 5,
    dateOfBirth: '2013-01-30',
    balance: -300,
    monthlyFee: 300,
    isArchived: false,
    avatarUrl: getImage('student3'),
  },
  {
    id: 'stu4',
    fullName: 'Diana Miller',
    grade: 8,
    dateOfBirth: '2010-11-05',
    balance: 0,
    monthlyFee: 400,
    isArchived: false,
    avatarUrl: getImage('student4'),
  },
  {
    id: 'stu5',
    fullName: 'Ethan Davis',
    grade: 7,
    dateOfBirth: '2011-06-18',
    balance: -700,
    monthlyFee: 350,
    isArchived: false,
    avatarUrl: getImage('student5'),
  },
  {
    id: 'stu6',
    fullName: 'Fiona Garcia',
    grade: 9,
    dateOfBirth: '2009-09-09',
    balance: 100,
    monthlyFee: 450,
    isArchived: true,
    avatarUrl: getImage('student6'),
  },
   {
    id: 'stu7',
    fullName: 'George Clark',
    grade: 5,
    dateOfBirth: '2013-02-15',
    balance: 0,
    monthlyFee: 300,
    isArchived: false,
    avatarUrl: getImage('student7'),
  },
  {
    id: 'stu8',
    fullName: 'Hannah Lewis',
    grade: 7,
    dateOfBirth: '2011-10-01',
    balance: -50,
    monthlyFee: 350,
    isArchived: false,
    avatarUrl: getImage('student8'),
  }
];

export const EXPENSES: Expense[] = [
    { id: 'exp1', date: '2024-05-01', amount: 500, description: 'Office Supplies' },
    { id: 'exp2', date: '2024-05-05', amount: 1200, description: 'Electricity Bill' },
    { id: 'exp3', date: '2024-05-10', amount: 300, description: 'Internet Bill' },
    { id: 'exp4', date: '2024-04-28', amount: 800, description: 'New Chairs' },
    { id: 'exp5', date: '2024-04-15', amount: 1150, description: 'Water Bill' },
];
