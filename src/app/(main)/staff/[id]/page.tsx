import { STAFF } from '@/lib/data';
import { notFound } from 'next/navigation';
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

export default function StaffProfilePage({ params }: { params: { id: string } }) {
  const staffMember = STAFF.find((s) => s.id === params.id);

  if (!staffMember) {
    notFound();
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
                ${staffMember.position.rate.toLocaleString()}
                {staffMember.position.type === 'hourly' && ' / soat'}
                {staffMember.position.type === 'monthly' && ' / oy'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Hisoblangan oylik</p>
              <p className="font-semibold">${calculateSalary()?.toLocaleString()}</p>
            </div>
          </div>
          {staffMember.position.type === 'hourly' && staffMember.hoursWorked && (
            <div className="flex items-center gap-4 md:col-span-2">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Haftalik ishlagan soatlari</p>
                <div className="font-semibold flex gap-2 flex-wrap">
                  {Object.entries(staffMember.hoursWorked).map(([day, hours]) => (
                    <Badge key={day} variant="secondary">{`${day}: ${hours} soat`}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
