// import React, { useState, useEffect } from 'react';
// import { Calendar, Filter, Download, Eye } from 'lucide-react';
// import Card, { CardContent, CardHeader } from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Badge from '../components/UI/Badge';
// import { issuanceAPI } from '../services/api';
// import { Issuance } from '../types';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const Issuances: React.FC = () => {
//   const [issuances, setIssuances] = useState<Issuance[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     issuedTo: '',
//     startDate: '',
//     endDate: ''
//   });

//   const recipientTypes = ['GIZ Guest', 'AZI Guest', 'Employee'];

//   useEffect(() => {
//     fetchIssuances();
//   }, []);

//   // const fetchIssuances = async () => {
//   //   try {
//   //     const response = await issuanceAPI.getAll(filters);
//   //     setIssuances(response.issuances || []);
//   //   } catch (error) {
//   //     console.error('Failed to fetch issuances:', error);
//   //     toast.error('Failed to load issuances');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };



//   const fetchIssuances = async () => {
//   try {
//     // Remove empty string fields from filters
//     const query = Object.fromEntries(
//       Object.entries(filters).filter(([_, value]) => value.trim() !== '')
//     );

//     const response = await issuanceAPI.getAll(query);
//     setIssuances(response.issuances || []);
//   } catch (error) {
//     console.error('Failed to fetch issuances:', error);
//     toast.error('Failed to load issuances');
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({ ...prev, [name]: value }));
//   };

//   const applyFilters = () => {
//     setLoading(true);
//     fetchIssuances();
//   };

//   const exportData = () => {
//     try {
//       // Create CSV content
//       const headers = ['Medicine', 'Category', 'Recipient', 'Type', 'Quantity', 'Prescribed By', 'Date', 'Time'];
//       const csvContent = [
//         headers.join(','),
//         ...issuances.map(issuance => [
//           `"${issuance.medicineId.name}"`,
//           `"${issuance.medicineId.category}"`,
//           `"${issuance.recipientName}"`,
//           `"${issuance.issuedTo}"`,
//           issuance.quantityIssued,
//           `"${issuance.prescribedBy}"`,
//           format(new Date(issuance.issuedAt), 'yyyy-MM-dd'),
//           format(new Date(issuance.issuedAt), 'HH:mm')
//         ].join(','))
//       ].join('\n');

//       // Create and download file
//       const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//       const link = document.createElement('a');
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', `issuances_${format(new Date(), 'yyyy-MM-dd')}.csv`);
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       toast.success('Export completed successfully');
//     } catch (error) {
//       toast.error('Failed to export data');
//     }
//   };

//   const getRecipientBadgeVariant = (type: string) => {
//     switch (type) {
//       case 'GIZ Guest': return 'info';
//       case 'AZI Guest': return 'warning';
//       case 'Employee': return 'success';
//       default: return 'default';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Medicine Issuances
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Track all medicine dispensing records
//           </p>
//         </div>
//         <Button onClick={exportData} className="flex items-center space-x-2">
//           <Download className="w-4 h-4" />
//           <span>Export</span>
//         </Button>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Recipient Type
//               </label>
//               <select
//                 name="issuedTo"
//                 value={filters.issuedTo}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">All Types</option>
//                 {recipientTypes.map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 name="startDate"
//                 value={filters.startDate}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 name="endDate"
//                 value={filters.endDate}
//                 onChange={handleFilterChange}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               />
//             </div>

//             <div className="flex items-end">
//               <Button onClick={applyFilters} className="w-full flex items-center justify-center space-x-2">
//                 <Filter className="w-4 h-4" />
//                 <span>Apply Filters</span>
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Issuances Table */}
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Recent Issuances ({issuances.length})
//           </h3>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-200 dark:border-gray-700">
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Medicine
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Recipient
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Type
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Quantity
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Prescribed By
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Date
//                   </th>
//                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {issuances.map((issuance) => (
//                   <tr key={issuance._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
//                     <td className="py-3 px-4">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           {issuance.medicineId.name}
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           {issuance.medicineId.category}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div>
//                         <p className="font-medium text-gray-900 dark:text-white">
//                           {issuance.recipientName}
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           ID: {issuance.recipientID}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <Badge variant={getRecipientBadgeVariant(issuance.issuedTo) as any}>
//                         {issuance.issuedTo}
//                       </Badge>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="font-medium text-gray-900 dark:text-white">
//                         {issuance.quantityIssued}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <span className="text-gray-900 dark:text-white">
//                         {issuance.prescribedBy}
//                       </span>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div>
//                         <p className="text-gray-900 dark:text-white">
//                           {format(new Date(issuance.issuedAt), 'MMM dd, yyyy')}
//                         </p>
//                         <p className="text-sm text-gray-500 dark:text-gray-400">
//                           {format(new Date(issuance.issuedAt), 'HH:mm')}
//                         </p>
//                       </div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <Button size="sm" variant="secondary">
//                         <Eye className="w-4 h-4" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {issuances.length === 0 && (
//             <div className="text-center py-12">
//               <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//                 No issuances found
//               </h3>
//               <p className="text-gray-500 dark:text-gray-400">
//                 No medicine issuances match your current filters.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Issuances;




import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, Eye, X } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Badge from '../components/UI/Badge';
import { issuanceAPI } from '../services/api';
import { Issuance } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Issuances: React.FC = () => {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
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

  const exportData = () => {
    try {
      const headers = ['Medicine', 'Category', 'Recipient', 'Type', 'Quantity', 'Prescribed By', 'Date', 'Time'];
      const csvContent = [
        headers.join(','),
        ...issuances.map(issuance => [
          `"${issuance.medicineId.name}"`,
          `"${issuance.medicineId.category}"`,
          `"${issuance.recipientName}"`,
          `"${issuance.issuedTo}"`,
          issuance.quantityIssued,
          `"${issuance.prescribedBy}"`,
          format(new Date(issuance.issuedAt), 'yyyy-MM-dd'),
          format(new Date(issuance.issuedAt), 'HH:mm')
        ].join(','))
      ].join('\n');

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
      {/* Header */}
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

      {/* Filters */}
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

      {/* Issuances Table */}
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
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Medicine</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Recipient</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Prescribed By</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issuances.map((issuance) => (
                  <tr key={issuance._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {issuance.medicineId?.name || 'Unknown Medicine'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {issuance.medicineId?.category || 'Unknown Category'}
                        </p>
                      </div>

                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{issuance.recipientName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">ID: {issuance.recipientID}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getRecipientBadgeVariant(issuance.issuedTo) as any}>{issuance.issuedTo}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900 dark:text-white">{issuance.quantityIssued}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900 dark:text-white">{issuance.prescribedBy}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-900 dark:text-white">{format(new Date(issuance.issuedAt), 'MMM dd, yyyy')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(issuance.issuedAt), 'HH:mm')}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="secondary" onClick={() => setSelectedIssuance(issuance)}>
                        <Eye className="w-4 h-4" />
                      </Button>
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

      {/* Detail View Card */}
      {selectedIssuance && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">

            {/* Close Button */}
            <button
              onClick={() => setSelectedIssuance(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Issuance Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Medicine</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedIssuance.medicineId.name}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Category</h4>
                <p className="text-gray-900 dark:text-white">{selectedIssuance.medicineId.category}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Recipient Name</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedIssuance.recipientName}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Recipient ID</h4>
                <p className="text-gray-900 dark:text-white">{selectedIssuance.recipientID}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Issued To</h4>
                <Badge variant={getRecipientBadgeVariant(selectedIssuance.issuedTo) as any}>
                  {selectedIssuance.issuedTo}
                </Badge>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Quantity Issued</h4>
                <p className="text-gray-900 dark:text-white">{selectedIssuance.quantityIssued}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Prescribed By</h4>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedIssuance.prescribedBy}</p>
              </div>

              <div>
                <h4 className="text-gray-500 dark:text-gray-400 mb-1">Issued Date</h4>
                <p className="text-gray-900 dark:text-white">{format(new Date(selectedIssuance.issuedAt), 'MMM dd, yyyy')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(selectedIssuance.issuedAt), 'HH:mm')}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedIssuance(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Issuances;
