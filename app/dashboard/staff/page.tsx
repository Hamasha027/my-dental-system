'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Trash2, Plus, User, Search, Pencil, Eye, Lock, FileText } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useStaff, useMonthlyRecords, useAddStaff, useAddMonthlyRecord, useDeleteStaff, useUpdateStaff, useCloseMonth } from '@/hooks/useStaffQueries';
import { usePagination } from '@/hooks/usePagination';
import { Pagination } from '@/components/pagination';


interface FormData {
  fullName: string;
  role: string;
  phonenumber: string;
  basicSalary: string;
  age: string;
  address: string;
  status: string;
}

interface AdvanceFormData {
  staffId: string;
  amount: string;
  note: string;
}

import { Suspense } from 'react';

const getMonthKey = (date = new Date()) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${month}-${date.getFullYear()}`;
};

function StaffPageContent() {
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useQueryState('search', {
    defaultValue: '',
  });

  // Dialog states
  const [openAddStaffDialog, setOpenAddStaffDialog] = useState(false);
  const [openAddAdvanceDialog, setOpenAddAdvanceDialog] = useState(false);
  const [openEditStaffDialog, setOpenEditStaffDialog] = useState(false);
  const [openAdvanceReasonDialog, setOpenAdvanceReasonDialog] = useState(false);
  const [openDeleteStaffDialog, setOpenDeleteStaffDialog] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<number | null>(null);
  const [selectedStaffName, setSelectedStaffName] = useState('');
  const [deletingStaffName, setDeletingStaffName] = useState('');
  const [selectedAdvanceDetails, setSelectedAdvanceDetails] = useState<
    Array<{ id: number; amount: string; date: string; note?: string }>
  >([]);

  // Form states
  const [staffFormData, setStaffFormData] = useState<FormData>({
    fullName: '',
    role: '',
    phonenumber: '',
    basicSalary: '',
    age: '',
    address: '',
    status: 'Active',
  });

  const [advanceFormData, setAdvanceFormData] = useState<AdvanceFormData>({
    staffId: '',
    amount: '',
    note: '',
  });

  const [editFormData, setEditFormData] = useState<FormData>({
    fullName: '',
    role: '',
    phonenumber: '',
    basicSalary: '',
    age: '',
    address: '',
    status: 'Active',
  });

  // Queries and Mutations
  const currentMonthKey = getMonthKey();
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const { data: transactions = [] } = useMonthlyRecords(currentMonthKey);
  const addStaffMutation = useAddStaff();
  const addTransactionMutation = useAddMonthlyRecord();
  const deleteStaffMutation = useDeleteStaff();
  const updateStaffMutation = useUpdateStaff();

  // Filtering and Pagination
  const filteredStaff = useMemo(() => {
    return staff.filter(
      (s) =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phonenumber.includes(searchTerm)
    );
  }, [staff, searchTerm]);

  const {
    page,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination({
    totalItems: filteredStaff.length,
    defaultPageSize: 10,
  });

  const paginatedStaff = useMemo(() => {
    return filteredStaff.slice(startIndex, endIndex);
  }, [filteredStaff, startIndex, endIndex]);

  // Calculate totals for a staff member
  const getStaffMonthlyAdvances = (staffId: number) => {
    return transactions.filter((t) => {
      return t.staffId === staffId && t.type === 'Advance' && !t.isPaid;
    });
  };

  const calculateStaffTotals = (staffId: number) => {
    const monthlyAdvances = getStaffMonthlyAdvances(staffId).reduce(
      (sum, t) => sum + parseFloat(t.amount || '0'),
      0
    );

    return monthlyAdvances;
  };

  const handleOpenAdvanceReason = (staffId: number, staffName: string) => {
    const details = getStaffMonthlyAdvances(staffId);
    setSelectedStaffName(staffName);
    setSelectedAdvanceDetails(details);
    setOpenAdvanceReasonDialog(true);
  };

  // Add staff handler
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!staffFormData.fullName || !staffFormData.role || !staffFormData.phonenumber) {
      return;
    }

    try {
      setSubmitting(true);
      await addStaffMutation.mutateAsync({
        fullName: staffFormData.fullName,
        role: staffFormData.role,
        phonenumber: staffFormData.phonenumber,
        basicSalary: staffFormData.basicSalary,
        status: staffFormData.status,
        age: staffFormData.age ? parseInt(staffFormData.age) : undefined,
        address: staffFormData.address,
      });

      setOpenAddStaffDialog(false);
      setStaffFormData({
        fullName: '',
        role: '',
        phonenumber: '',
        basicSalary: '',
        age: '',
        address: '',
        status: 'Active',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Add advance handler
  const handleAddAdvance = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!advanceFormData.staffId || !advanceFormData.amount) {
      return;
    }

    try {
      setSubmitting(true);
      await addTransactionMutation.mutateAsync({
        staffId: parseInt(advanceFormData.staffId),
        amount: advanceFormData.amount,
        type: 'Advance',
        date: new Date().toISOString(),
        note: advanceFormData.note,
        monthKey: currentMonthKey,
      });

      setOpenAddAdvanceDialog(false);
      setAdvanceFormData({
        staffId: '',
        amount: '',
        note: '',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete staff handler
  const handleAskDeleteStaff = (id: number, fullName: string) => {
    setDeletingStaffId(id);
    setDeletingStaffName(fullName);
    setOpenDeleteStaffDialog(true);
  };

  const handleConfirmDeleteStaff = async () => {
    if (!deletingStaffId) return;

    await deleteStaffMutation.mutateAsync(deletingStaffId);
    setOpenDeleteStaffDialog(false);
    setDeletingStaffId(null);
    setDeletingStaffName('');
  };

  const handleOpenEditStaff = (staffMember: {
    id: number;
    fullName: string;
    role: string;
    phonenumber: string;
    basicSalary: string;
    age?: number;
    address?: string;
    status: string;
  }) => {
    setEditingStaffId(staffMember.id);
    setEditFormData({
      fullName: staffMember.fullName,
      role: staffMember.role,
      phonenumber: staffMember.phonenumber,
      basicSalary: staffMember.basicSalary || '',
      age: staffMember.age ? staffMember.age.toString() : '',
      address: staffMember.address || '',
      status: staffMember.status || 'Active',
    });
    setOpenEditStaffDialog(true);
  };

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStaffId || !editFormData.fullName || !editFormData.role || !editFormData.phonenumber) {
      return;
    }

    try {
      setSubmitting(true);
      await updateStaffMutation.mutateAsync({
        id: editingStaffId,
        fullName: editFormData.fullName,
        role: editFormData.role,
        phonenumber: editFormData.phonenumber,
        basicSalary: editFormData.basicSalary,
        age: editFormData.age ? parseInt(editFormData.age) : undefined,
        address: editFormData.address,
        status: editFormData.status,
      });

      setOpenEditStaffDialog(false);
      setEditingStaffId(null);
      setEditFormData({
        fullName: '',
        role: '',
        phonenumber: '',
        basicSalary: '',
        age: '',
        address: '',
        status: 'Active',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (!Number.isFinite(num) || num === 0) return '0';
    return num.toLocaleString('ku-IQ', { maximumFractionDigits: 0 });
  };

  // Format input with commas while keeping numeric value clean
  const formatInputValue = (value: string) => {
    if (!value) return '';
    const numericValue = value.replace(/,/g, '');
    const num = parseFloat(numericValue);
    if (isNaN(num)) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  if (staffLoading) {
    return (
      <div className="flex h-screen items-center justify-center" dir="rtl">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1.5" dir="rtl">
      {/* Search Bar */}
      <div className="flex flex-row items-center justify-between gap-2 ">
        {/* Search Section */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none shrink-0" />
          <Input
            placeholder="گەڕان"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-border/90 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 pr-10 h-10"
          />
        </div>

        <div className="flex gap-1 flex-shrink-0">
          <Button
            onClick={() => setOpenAddAdvanceDialog(true)}
            className="bg-primary hover:shadow-lg hover:shadow-primary/30 active:scale-95 active:shadow-inner gap-1 text-white font-bold px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all duration-150"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>پێشەکی</span>
          </Button>
          <Button
            onClick={() => setOpenAddStaffDialog(true)}
            className="bg-primary hover:shadow-lg hover:shadow-primary/30 active:scale-95 active:shadow-inner gap-1 text-white font-semibold px-2 sm:px-3 py-2 text-xs sm:text-sm transition-all duration-150"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>کارمەند</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border border-primary shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-primary">ژمارەی کارمەندەکان</p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-primary">
                {staff.length}
              </p>
            </div>
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
          </div>
        </Card>

        
        <Card className="border border-red-500 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">کۆی مووچەی بنەڕەتی</p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-red-900 dark:text-red-100">
                {formatCurrency(
                  staff.reduce((sum, s) => sum + parseFloat(s.basicSalary || '0'), 0)
                )}
              </p>
            </div>
           <h1 className='text-xl sm:text-2xl font-bold text-amber-900 dark:text-amber-100'>IQD</h1>
          </div>
        </Card>

        <Card className="border border-green-500 shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400"> بڕی موچەی ماوە</p>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100">
                {formatCurrency(
                  staff.reduce(
                    (sum, s) => sum + (parseFloat(s.basicSalary || '0') - calculateStaffTotals(s.id)),
                    0
                  )
                )}
              </p>
            </div>
            <h1 className='text-xl sm:text-2xl font-bold text-green-900 dark:text-green-100'>IQD</h1>
          </div>
        </Card>

      </div>

      {/* Staff Table */}
      <div className="rounded-xl border border-border/40 shadow-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
        <Table>
            <TableHeader className="bg-primary/5 border-b border-border/40">
              <TableRow className="hover:bg-primary/2 transition-colors">
                <TableHead className="text-right text-primary font-bold">
                  ناوی کارمەند
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  پلەی کارمەند
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  ژمارە تەلەفۆن
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  تەمەن
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  ناونیشان
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  مووچەی بنەڕەتی
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  کۆی پێشەکییەکان
                </TableHead>
                <TableHead className="text-right text-primary font-bold">
                  بڕی ماوەی مووچە
                </TableHead>
                <TableHead className="text-center text-primary font-bold">
                  کردارەکان
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground hover:bg-transparent">
                    <div className="flex flex-col items-center gap-2">
                      <User className="w-12 h-12 opacity-30 mx-auto" />
                      <span className="text-lg">{searchTerm ? 'هیچ کارمەندێک نەدۆزرایەوە!' : 'هیچ کارمەند نیە'}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedStaff.map((s, index) => {
                  const totalAdvances = calculateStaffTotals(s.id);
                  const basicSalary = parseFloat(s.basicSalary || '0');
                  const remainingSalary = basicSalary - totalAdvances;

                  return (
                    <TableRow
                      key={s.id}
                      className={`transition-all duration-200 border-b border-gray-100 dark:border-gray-800 ${
                        index % 2 === 0 
                          ? 'bg-white dark:bg-slate-950' 
                          : 'bg-primary/2 dark:bg-slate-900/30'
                      } hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors`}
                    >
                      <TableCell className="text-xs font-semibold text-foreground">
                        {s.fullName}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground/80">{s.role}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground/80">

                          {s.phonenumber}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground/80">
                        {s.age ? `${s.age} ساڵ` : '-'}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground/80">
                        {s.address || '-'}
                      </TableCell>
                      <TableCell className="text-foreground/70">
                        <span className="inline-flex h-5 items-center justify-center whitespace-nowrap rounded-4xl bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          {formatCurrency(basicSalary)}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground/70">
                        <div className="flex items-center justify-start gap-1">
                          <span
                            className="inline-flex h-5 items-center justify-center whitespace-nowrap rounded-4xl bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800 dark:bg-red-900/40 dark:text-red-300"
                          >
                            {formatCurrency(totalAdvances)}
                          </span>
                          {totalAdvances > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              type="button"
                              onClick={() => handleOpenAdvanceReason(s.id, s.fullName)}
                              className="h-6 px-1 text-primary hover:bg-primary/10"
                              title="پیشاندانی هۆکاری پێشەکی"
                            >
                              <Eye className="h-4 w-4  text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex h-5 items-center justify-center whitespace-nowrap rounded-4xl bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800 dark:bg-green-900/40 dark:text-green-300">
                          {formatCurrency(remainingSalary)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditStaff(s)}
                            className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAskDeleteStaff(s.id, s.fullName)}
                            disabled={deleteStaffMutation.isPending}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900"
                          >
                            {deleteStaffMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="border-t border-border/40 bg-primary/2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            isLoading={staffLoading}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>
      </div>

      {/* Advance Reason Dialog */}
      <Dialog open={openAdvanceReasonDialog} onOpenChange={setOpenAdvanceReasonDialog}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">هۆکاری پێشەکی</DialogTitle>
            <DialogDescription className="text-center">
              {selectedStaffName ? `تێبینییەکانی ${selectedStaffName}` : 'تێبینی پێشەکی'}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-72 space-y-3 overflow-y-auto">
            {selectedAdvanceDetails.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">هیچ پێشەکییەک بەم مانگە تۆمار نەکراوە.</p>
            ) : (
              selectedAdvanceDetails.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-muted/30 p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-semibold text-red-700 dark:text-red-300">
                      {formatCurrency(item.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('ku-IQ')}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/90">
                    {item.note?.trim() ? item.note : 'هیچ تێبینییەک نەنووسراوە.'}
                  </p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Staff Confirmation Dialog */}
      <Dialog
        open={openDeleteStaffDialog}
        onOpenChange={(open) => {
          setOpenDeleteStaffDialog(open);
          if (!open) {
            setDeletingStaffId(null);
            setDeletingStaffName('');
          }
        }}
      >
        <DialogContent className="max-w-[95vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center">دڵنیابوونەوە</DialogTitle>
            <DialogDescription className="text-center">
              {deletingStaffName
                ? `ئایا دڵنیایت لە سڕینەوەی ${deletingStaffName}؟`
                : 'ئایا دڵنیایت لە سڕینەوەی ئەم کارمەندە؟'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDeleteStaff}
              disabled={deleteStaffMutation.isPending}
              className="flex-1"
            >
              {deleteStaffMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : null}
              بەڵێ ، بیسڕەوە
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenDeleteStaffDialog(false)}
              className="flex-1"
            >
              پاشگەزبوونەوە
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={openAddStaffDialog} onOpenChange={setOpenAddStaffDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className='text-center'>زیادکردنی کارمەند نوێ</DialogTitle>
          
          </DialogHeader>

          <form onSubmit={handleAddStaff} className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  ناوی کارمەند *
                </label>
                <Input
                  className="sm:col-span-2"
                  placeholder="ناوی کارمەند"
                  value={staffFormData.fullName}
                  onChange={(e) =>
                    setStaffFormData({ ...staffFormData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  پلەی کارمەند *
                </label>
                <Input
                  className="sm:col-span-2"
                  placeholder="بۆ نموونە: پەرستار"
                  value={staffFormData.role}
                  onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  ژمارە تەلەفۆن *
                </label>
                <Input
                  className="sm:col-span-2"
                  placeholder="ژمارە تەلەفۆن"
                  value={staffFormData.phonenumber}
                  onChange={(e) =>
                    setStaffFormData({ ...staffFormData, phonenumber: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  مووچەی بنەڕەتی
                </label>
                <Input
                  className="sm:col-span-2"
                  type="text"
                  inputMode="numeric"
                  placeholder="مووچەی بنەڕەتی"
                  value={staffFormData.basicSalary.replace(/,/g, '')}
                  onChange={(e) => {
                    const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                    setStaffFormData({ ...staffFormData, basicSalary: numericValue })
                  }}
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  تەمەنی کارمەند
                </label>
                <Input
                  className="sm:col-span-2"
                  type="number"
                  placeholder="تەمەنی کارمەند"
                  value={staffFormData.age}
                  onChange={(e) => setStaffFormData({ ...staffFormData, age: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  ناونیشان
                </label>
                <Input
                  className="sm:col-span-2"
                  placeholder="ناونیشان"
                  value={staffFormData.address}
                  onChange={(e) => setStaffFormData({ ...staffFormData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 sm:col-span-1">
                  بارودۆخ
                </label>
                <div className="sm:col-span-2">
                  <Select
                    value={staffFormData.status}
                    onValueChange={(value) =>
                      setStaffFormData({ ...staffFormData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="Active">چالاک</SelectItem>
                      <SelectItem value="Inactive">ناچالاک</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={submitting || addStaffMutation.isPending}
                className="flex-1 bg-primary hover:shadow-lg hover:shadow-primary/30 text-white font-semibold"
              >
                {submitting || addStaffMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                زیادکردن
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAddStaffDialog(false)}
              >
                داخستن
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Staff Dialog */}
      <Dialog open={openEditStaffDialog} onOpenChange={setOpenEditStaffDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className='text-center'>دەستکاریکردنی زانیاری کارمەند</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditStaff} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ناوی کارمەند *
              </label>
              <Input
                placeholder="ناوی کارمەند"
                value={editFormData.fullName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, fullName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                پلەی کارمەند *
              </label>
              <Input
                placeholder="بۆ نموونە: پەرستار"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ژمارە تەلەفۆن *
              </label>
              <Input
                placeholder="ژمارە تەلەفۆن"
                value={editFormData.phonenumber}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phonenumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                مووچەی بنەڕەتی
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="مووچەی بنەڕەتی"
                value={editFormData.basicSalary.replace(/,/g, '')}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                  setEditFormData({ ...editFormData, basicSalary: numericValue })
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                تەمەنی کارمەند
              </label>
              <Input
                type="number"
                placeholder="تەمەنی کارمەند"
                value={editFormData.age}
                onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ناونیشان
              </label>
              <Input
                placeholder="ناونیشان"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                بارودۆخ
              </label>
              <Select
                value={editFormData.status}
                onValueChange={(value) =>
                  setEditFormData({ ...editFormData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="Active">چالاک</SelectItem>
                  <SelectItem value="Inactive">ناچالاک</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={submitting || updateStaffMutation.isPending}
                className="flex-1 bg-primary hover:shadow-lg hover:shadow-primary/30 text-white font-semibold"
              >
                {submitting || updateStaffMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                نوێکردنەوە
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEditStaffDialog(false)}
              >
                داخستن
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Advance Dialog */}
      <Dialog open={openAddAdvanceDialog} onOpenChange={setOpenAddAdvanceDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className='text-center'> وەرگرتنی پێشەکی </DialogTitle>
           
          </DialogHeader>

          <form onSubmit={handleAddAdvance} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                کارمەند *
              </label>
              <Select
                value={advanceFormData.staffId}
                onValueChange={(value) =>
                  setAdvanceFormData({ ...advanceFormData, staffId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder=" ناوی کارمەند دیاری بکە" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {staff.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.fullName} - {s.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                بڕی پارە *
              </label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="بڕی پارە"
                value={advanceFormData.amount.replace(/,/g, '')}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/[^0-9.]/g, '');
                  setAdvanceFormData({ ...advanceFormData, amount: numericValue })
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                تێبینی
              </label>
              <Input
                placeholder="تێبینی ( بۆ نموونە : بۆ کاری پێویست )"
                value={advanceFormData.note}
                onChange={(e) =>
                  setAdvanceFormData({ ...advanceFormData, note: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={submitting || addTransactionMutation.isPending}
                className="flex-1 bg-primary hover:shadow-lg hover:shadow-primary/30 text-white font-semibold"
              >
                {submitting || addTransactionMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                تۆمارکردن
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenAddAdvanceDialog(false)}
              >
                داخستن
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function StaffPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center" dir="rtl">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <StaffPageContent />
    </Suspense>
  );
}
