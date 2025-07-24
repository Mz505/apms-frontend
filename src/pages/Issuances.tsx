
import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Eye, X } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { issuanceAPI } from '../services/api';
import { Issuance } from '../types';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Issuances: React.FC = () => {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  // const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Issuance | null>(null);


  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this issuance?")) return;
    try {
      await issuanceAPI.delete(id);
      toast.success("Issuance deleted");
      fetchIssuances(); // refresh
    } catch (err) {
      toast.error("Delete failed");
    }
  };


  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    issuedTo: '',
    startDate: '',
    endDate: ''
  });
  const [selectedIssuance, setSelectedIssuance] = useState<Issuance | null>(null);

  const recipientTypes = ['GIZ Guest', 'AZI Guest', 'Employee'];

  useEffect(() => {
    fetchIssuances();
  }, []);

  const fetchIssuances = async () => {
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );

      const response = await issuanceAPI.getAll(cleanedFilters);
      setIssuances(response.issuances || []);
    } catch (error) {
      console.error('Failed to fetch issuances:', error);
      toast.error('Failed to load issuances');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setLoading(true);
    fetchIssuances();
  };

  // const exportData = () => {
  //   try {
  //     const headers = ['Medicines', 'Recipient', 'Type', 'Prescribed By', 'Date', 'Time'];
  //     const csvContent = [
  //       headers.join(','),
  //       ...issuances.map(issuance => [
  //         // `"${issuance.issuedMedicines.map(m => m.medicineId.name).join('; ')}"`,
  //         `"${issuance.issuedMedicines.map(m => `${m.medicineId.name} (Qty: ${m.quantityIssued})`).join('; ')}"`,

  //         `"${issuance.recipientName}"`,
  //         `"${issuance.issuedTo}"`,
  //         `"${issuance.prescribedBy}"`,
  //         format(new Date(issuance.issuedAt), 'yyyy-MM-dd'),
  //         format(new Date(issuance.issuedAt), 'HH:mm')
  //       ].join(','))
  //     ].join('\n');

  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     const link = document.createElement('a');
  //     const url = URL.createObjectURL(blob);
  //     link.setAttribute('href', url);
  //     link.setAttribute('download', `issuances_${format(new Date(), 'yyyy-MM-dd')}.csv`);
  //     link.style.visibility = 'hidden';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     toast.success('Export completed successfully');
  //   } catch (error) {
  //     toast.error('Failed to export data');
  //   }
  // };
  const exportData = () => {
    try {
      const headers = ['Medicine Name', 'Category', 'Quantity', 'Recipient', 'Type', 'Prescribed By', 'Date', 'Time'];
      const csvRows = [headers.join(',')];

      issuances.forEach((issuance) => {
        issuance.issuedMedicines.forEach((item) => {
          const name = item.medicineId?.name || 'N/A';
          const category = item.medicineId?.category || 'N/A';
          const quantity = item.quantityIssued;
          const row = [
            `"${name}"`,
            `"${category}"`,
            quantity,
            `"${issuance.recipientName}"`,
            `"${issuance.issuedTo}"`,
            `"${issuance.prescribedBy}"`,
            format(new Date(issuance.issuedAt), 'yyyy-MM-dd'),
            format(new Date(issuance.issuedAt), 'HH:mm'),
          ].join(',');
          csvRows.push(row);
        });
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `issuances_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export completed successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };


  const getRecipientBadgeVariant = (type: string) => {
    switch (type) {
      case 'GIZ Guest': return 'info';
      case 'AZI Guest': return 'warning';
      case 'Employee': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Medicine Issuances
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all medicine dispensing records
          </p>
        </div>
        <Button onClick={exportData} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Recipient Type
              </label>
              <select
                name="issuedTo"
                value={filters.issuedTo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Types</option>
                {recipientTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={applyFilters} className="w-full flex items-center justify-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>Apply Filters</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Issuances ({issuances.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Medicines</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Recipient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Prescribed By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuances.map((issuance) => (
                  <tr
                    key={issuance._id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >

                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {issuance.issuedMedicines.map((m, idx) => (
                        <div key={idx} className="mb-1">
                          <p className="font-medium text-gray-900 dark:text-white">{m.medicineId.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {m.quantityIssued}</p>
                        </div>
                      ))}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900 dark:text-white">{issuance.recipientName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">ID: {issuance.recipientID}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRecipientBadgeVariant(issuance.issuedTo)}>{issuance.issuedTo}</Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-white">{issuance.prescribedBy}</td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900 dark:text-white">{format(new Date(issuance.issuedAt), 'MMM dd, yyyy')}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(issuance.issuedAt), 'HH:mm')}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">

                        <Button size="sm" variant="secondary" onClick={() => setSelectedIssuance(issuance)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="pr-2"
                          onClick={() => handleDelete(issuance._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>


                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {issuances.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No issuances found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No medicine issuances match your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedIssuance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
            <button onClick={() => setSelectedIssuance(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Issuance Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Recipient Name</p>
                <p className="font-bold text-gray-900 dark:text-white">{selectedIssuance.recipientName}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Recipient ID</p>
                <p className="text-gray-900 dark:text-white">{selectedIssuance.recipientID}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Type</p>
                <Badge variant={getRecipientBadgeVariant(selectedIssuance.issuedTo)}>{selectedIssuance.issuedTo}</Badge>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Prescribed By</p>
                <p className="text-gray-900 dark:text-white">{selectedIssuance.prescribedBy}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 dark:text-gray-400">Medicines Issued</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 dark:text-white">
                  {selectedIssuance.issuedMedicines.map((med, idx) => (
                    <li key={idx}>
                      {med.medicineId.name} ({med.medicineId.category}) - Qty: {med.quantityIssued}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedIssuance(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issuances;

