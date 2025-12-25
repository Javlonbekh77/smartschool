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
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth';
import type { UserCredentials } from '@/lib/types';
import { AddUserDialog } from '@/components/dialogs/add-user-dialog';
import { EditUserDialog } from '@/components/dialogs/edit-user-dialog';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { UserDataTableRowActions } from '@/components/users/user-data-table-row-actions';

export default function UsersPage() {
  const { user, users, setUsers } = useAuth();
  const [dialogState, setDialogState] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedUser, setSelectedUser] = useState<UserCredentials | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openDialog = (dialog: keyof typeof dialogState, userToActOn?: UserCredentials) => {
    if (user?.role !== 'admin' || (dialog !== 'add' && !userToActOn)) return;
    
    // Main admin cannot be deleted or edited by others, and cannot delete themselves
    if (dialog === 'delete' && userToActOn?.username === 'Admin') return;
    if (dialog === 'edit' && userToActOn?.username === 'Admin' && user.username !== 'Admin') return;

    setSelectedUser(userToActOn || null);
    setDialogState(prev => ({ ...prev, [dialog]: true }));
  };

  const closeDialog = (dialog: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialog]: false }));
    setSelectedUser(null);
  };

  const handleAddUser = (newUser: Omit<UserCredentials, 'id'>) => {
    setUsers(prev => [...prev, { ...newUser, id: `user-${Date.now()}` }]);
    closeDialog('add');
  };

  const handleUpdateUser = (userId: string, data: Partial<UserCredentials>) => {
    setUsers(prev => prev.map(u => (u.id === userId ? { ...u, ...data } : u)));
    closeDialog('edit');
  };

  const handleDeleteUser = () => {
    if (!selectedUser || selectedUser.username === 'Admin') return;
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    closeDialog('delete');
  };

  if (!isMounted || user?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unauthorized</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="font-headline">Foydalanuvchilar</CardTitle>
              <CardDescription>
                Yangi adminlar qo'shing va mavjudlarini boshqaring.
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" className="gap-1" onClick={() => openDialog('add')}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add User
                </span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.username}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     {u.username !== 'Admin' && (
                        <UserDataTableRowActions
                            user={u}
                            onEdit={() => openDialog('edit', u)}
                            onDelete={() => openDialog('delete', u)}
                        />
                     )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Showing <strong>1-{users.length}</strong> of <strong>{users.length}</strong> users.
            </div>
        </CardFooter>
      </Card>
      
      <AddUserDialog
        isOpen={dialogState.add}
        onClose={() => closeDialog('add')}
        onAddUser={handleAddUser}
        existingUsers={users}
      />
      <EditUserDialog
        isOpen={dialogState.edit}
        onClose={() => closeDialog('edit')}
        user={selectedUser}
        onUpdateUser={handleUpdateUser}
      />
      <ConfirmDialog
        isOpen={dialogState.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={handleDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete user ${selectedUser?.username}? This action cannot be undone.`}
      />
    </>
  );
}
