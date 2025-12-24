'use client';
import { STAFF as initialStaff } from '@/lib/data';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Briefcase, DollarSign, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Staff } from '@/lib/types';

// This would typically come from a state management solution or props
const findStaffMember = (id: string, staffList: Staff[]) => staffList.find(s => s.id === id);


export default function StaffProfilePage() {
  const router = useRouter();
  const params = useParams();
  const staffId = typeof params.id === 'string' ? params.id : '';
  
  // In a real app, this would be a single fetch, not the whole list.
  // We use state to simulate deletion/updates without a real backend.
  const [staffList, setStaffList] = useState(initialStaff);
  const staffMember = findStaffMember(staffId, staffList);

  useEffect(() => {
    if (!staffMember) {
      // If the staff member is not found, it might have been deleted.
      // Redirect to the staff list page.
      router.push('/staff');
    }
  }, [staffMember, router]);

  if (!staffMember) {
    return null; // Render nothing while redirecting or loading
  }
  
  const calculateSalary = () => {
    if (staffMember.position.type === 'monthly') {
      return staffMember.salary;
    }
    if (staffMember.position.type === 'hourly' && staffMember.hoursWorked) {
      const totalHours = Object.values(staffMember.hoursWorked).reduce((sum, h) => sum + h, 0);
      return totalHours * 4 * staffMember.position.rate; // Assuming 4 weeks in a month
    }
    return 0;
  }

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={staffMember.avatarUrl} alt={staffMember.fullName} />
          <AvatarFallback>{staffMember.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-3xl">{staffMember.fullName}</CardTitle>
        <CardDescription>{staffMember.position.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Kasbi</p>
              <p className="font-semibold">{staffMember.position.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="capitalize text-sm">{staffMember.position.type}</Badge>
            <div>
              <p className="text-sm text-muted-foreground">To'lov turi</p>
              <p className="font-semibold">
                {staffMember.position.rate.toLocaleString()}
                {staffMember.position.type === 'hourly' && ' so\'m / soat'}
                {staffMember.position.type === 'monthly' && ' so\'m / oy'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hisoblangan oylik</p>
              <p className="font-semibold">{calculateSalary()?.toLocaleString()} so'm</p>
            </div>
          </div>
        </div>
        {staffMember.position.type === 'hourly' && staffMember.hoursWorked && (
          <div className="max-w-2xl mx-auto mt-6">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Haftalik ish soatlari
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="font-semibold flex justify-around gap-2 flex-wrap">
                      {Object.entries(staffMember.hoursWorked).map(([day, hours]) => (
                        <div key={day} className="flex flex-col items-center p-2 rounded-md">
                           <p className="text-sm text-muted-foreground">{day}</p>
                           <p className="text-lg font-bold">{hours} soat</p>
                        </div>
                      ))}
                    </div>
                </CardContent>
             </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
