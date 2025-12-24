import { STUDENTS } from '@/lib/data';
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
import { GraduationCap, Cake, DollarSign, TrendingUp } from 'lucide-react';
import { differenceInYears } from 'date-fns';

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const student = STUDENTS.find((s) => s.id === params.id);

  if (!student) {
    notFound();
  }

  const age = differenceInYears(new Date(), new Date(student.dateOfBirth));

  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={student.avatarUrl} alt={student.fullName} />
          <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <CardTitle className="font-headline text-3xl">{student.fullName}</CardTitle>
        <CardDescription>
          {student.grade}-sinf o'quvchisi
          {student.isArchived && <Badge variant="outline" className="ml-2">Arxivlangan</Badge>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Sinf</p>
              <p className="font-semibold">{student.grade}-sinf</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Cake className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Yoshi</p>
              <p className="font-semibold">{age} yosh</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Balans</p>
              <Badge variant={student.balance < 0 ? "destructive" : "default"} className={student.balance > 0 ? "bg-green-600 text-white" : ""}>
                {student.balance.toLocaleString()} so'm
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Oylik to'lov</p>
              <p className="font-semibold">{student.monthlyFee.toLocaleString()} so'm</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
