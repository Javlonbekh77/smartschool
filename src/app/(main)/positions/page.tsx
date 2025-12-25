'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { POSITIONS as initialPositions } from '@/lib/data';
import type { Position } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AddPositionDialog } from '@/components/dialogs/add-position-dialog';
import { EditPositionDialog } from '@/components/dialogs/edit-position-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { PositionDataTableRowActions } from '@/components/positions/position-data-table-row-actions';
import useLocalStorage from '@/hooks/use-local-storage';

export default function PositionsPage() {
  const [positions, setPositions] = useLocalStorage<Position[]>('positions', initialPositions);
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openDialog = (dialog: keyof typeof dialogState, position?: Position) => {
    setSelectedPosition(position || null);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setSelectedPosition(null);
  };

  const handleAddPosition = (newPosition: Omit<Position, 'id'>) => {
    const positionToAdd: Position = {
        id: `pos${Date.now()}`,
        ...newPosition
    };
    setPositions(prev => [...prev, positionToAdd]);
  };
  
  const handleUpdatePosition = (positionId: string, data: Omit<Position, 'id'>) => {
    setPositions(prev => prev.map(p => p.id === positionId ? { ...p, ...data } : p));
    closeDialog('edit');
  };

  const handleDeletePosition = () => {
    if (!selectedPosition) return;
    setPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
    closeDialog('delete');
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Kasblar</CardTitle>
              <CardDescription>
                Manage job positions and their payment structures.
              </CardDescription>
            </div>
            <div className="ml-auto">
              <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Position
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rate / Salary</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => (
                <TableRow key={position.id}>
                  <TableCell className="font-medium">{position.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {position.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {position.rate.toLocaleString()}
                    {position.type === 'hourly' && ' so\'m / soat'}
                    {position.type === 'monthly' && ' so\'m / oy'}
                  </TableCell>
                  <TableCell className="text-right">
                    <PositionDataTableRowActions 
                        position={position}
                        onEdit={() => openDialog('edit', position)}
                        onDelete={() => openDialog('delete', position)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{positions.length}</strong> of{' '}
            <strong>{positions.length}</strong> positions.
          </div>
        </CardFooter>
      </Card>
      <AddPositionDialog
        isOpen={dialogState.add}
        onClose={() => closeDialog('add')}
        onAddPosition={handleAddPosition}
      />
      <EditPositionDialog
        isOpen={dialogState.edit}
        onClose={() => closeDialog('edit')}
        position={selectedPosition}
        onUpdatePosition={handleUpdatePosition}
      />
      <ConfirmDialog
        isOpen={dialogState.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={handleDeletePosition}
        title="Kasbni o'chirish"
        description={`Haqiqatan ham ${selectedPosition?.name} kasbini o'chirmoqchimisiz? Bu amalni orqaga qaytarib bo'lmaydi.`}
      />
    </>
  );
}
