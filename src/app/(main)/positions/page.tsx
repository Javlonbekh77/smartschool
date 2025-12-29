'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { PlusCircle, Upload, Download } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { POSITIONS as initialPositions, AUDIT_LOGS as initialAuditLogs } from '@/lib/data';
import type { Position, AuditLog } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { AddPositionDialog } from '@/components/dialogs/add-position-dialog';
import { EditPositionDialog } from '@/components/dialogs/edit-position-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { PositionDataTableRowActions } from '@/components/positions/position-data-table-row-actions';
import useLocalStorage from '@/hooks/use-local-storage';
import { useAuth } from '@/context/auth';

export default function PositionsPage() {
  const { user } = useAuth();
  const [positions, setPositions] = useLocalStorage<Position[]>('positions', initialPositions);
  const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('audit_logs', initialAuditLogs);

  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logAction = (action: AuditLog['action'], details: string) => {
    if (!user) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminUsername: user.username,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  const openDialog = (dialog: keyof typeof dialogState, position?: Position) => {
    if (user?.role !== 'admin') return;
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
    logAction('add_position', `Added position: ${newPosition.name}`);
    closeDialog('add');
  };
  
  const handleUpdatePosition = (positionId: string, data: Omit<Position, 'id'>) => {
    setPositions(prev => prev.map(p => p.id === positionId ? { ...p, ...data } : p));
    logAction('edit_position', `Edited position: ${data.name}`);
    closeDialog('edit');
  };

  const handleDeletePosition = () => {
    if (!selectedPosition) return;
    setPositions(prev => prev.filter(p => p.id !== selectedPosition.id));
    logAction('delete_position', `Deleted position: ${selectedPosition.name}`);
    closeDialog('delete');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(positions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'positions.json');
    linkElement.click();
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!event.target.files) return;
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      if (typeof e.target?.result === 'string') {
        const importedData: Position[] = JSON.parse(e.target.result);
        setPositions(importedData);
      }
    };
    event.target.value = '';
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
             {user?.role === 'admin' && (
              <div className="ml-auto flex items-center gap-2">
                 <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                <Button size="sm" variant="outline" className="gap-1" onClick={handleImportClick}>
                  <Upload className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Import</span>
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
                </Button>
                <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Position
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rate / Salary</TableHead>
                {user?.role === 'admin' && <TableHead><span className="sr-only">Actions</span></TableHead>}
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
                   {user?.role === 'admin' && (
                    <TableCell className="text-right">
                      <PositionDataTableRowActions 
                          position={position}
                          onEdit={() => openDialog('edit', position)}
                          onDelete={() => openDialog('delete', position)}
                      />
                    </TableCell>
                  )}
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
      {user?.role === 'admin' && (
        <>
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
      )}
    </>
  );
}
