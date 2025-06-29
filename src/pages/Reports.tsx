// import React, { useState } from 'react';
// import { FileText, Download, Calendar, Package, TrendingUp } from 'lucide-react';
// import Card, { CardContent, CardHeader } from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import { reportsAPI } from '../services/api';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const Reports: React.FC = () => {
//   const [loading, setLoading] = useState<string | null>(null);
//   const [filters, setFilters] = useState({
//     startDate: '',
//     endDate: '',
//     category: '',
//     issuedTo: ''
//   });

//   const reportTypes = [
//     {
//       id: 'inventory',
//       title: 'Inventory Report',
//       description: 'Complete medicine inventory with stock levels and values',
//       icon: Package,
//       color: 'blue'
//     },
//     {
//       id: 'issuance',
//       title: 'Issuance Report',
//       description: 'Medicine dispensing records by date range and recipient type',
//       icon: TrendingUp,
//       color: 'green'
//     },
//     {
//       id: 'expiry',
//       title: 'Expiry Report',
//       description: 'Medicines expiring soon and expired medicines',
//       icon: Calendar,
//       color: 'yellow'
//     },
//     {
//       id: 'lowstock',
//       title: 'Low Stock Report',
//       description: 'Medicines below minimum stock threshold',
//       icon: FileText,
//       color: 'red'
//     }
//   ];

//   const generateReport = async (reportType: string) => {
//     setLoading(reportType);
//     try {
//       let response;
      
//       switch (reportType) {
//         case 'inventory':
//           response = await reportsAPI.getInventoryReport({
//             category: filters.category || undefined
//           });
//           break;
//         case 'issuance':
//           response = await reportsAPI.getIssuanceReport({
//             startDate: filters.startDate || undefined,
//             endDate: filters.endDate || undefined,
//             issuedTo: filters.issuedTo || undefined
//           });
//           break;
//         case 'expiry':
//           response = await reportsAPI.getExpiryReport();
//           break;
//         case 'lowstock':
//           response = await reportsAPI.getInventoryReport({ lowStock: true });
//           break;
//         default:
//           throw new Error('Invalid report type');
//       }

//       // Generate and download CSV
//       downloadCSV(response, reportType);
//       toast.success('Report generated successfully');
//     } catch (error) {
//       console.error('Failed to generate report:', error);
//       toast.error('Failed to generate report');
//     } finally {
//       setLoading(null);
//     }
//   };

//   const downloadCSV = (data: any, reportType: string) => {
//     let csvContent = '';
//     let filename = '';

//     switch (reportType) {
//       case 'inventory':
//       case 'lowstock':
//         csvContent = generateInventoryCSV(data);
//         filename = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
//         break;
//       case 'issuance':
//         csvContent = generateIssuanceCSV(data);
//         filename = `issuance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
//         break;
//       case 'expiry':
//         csvContent = generateExpiryCSV(data);
//         filename = `expiry_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
//         break;
//     }

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const generateInventoryCSV = (data: any) => {
//     const headers = ['Name', 'Category', 'Quantity', 'Min Quantity', 'Price', 'Expiry Date', 'Supplier', 'Batch Number'];
//     const rows = data.medicines.map((medicine: any) => [
//       `"${medicine.name}"`,
//       `"${medicine.category}"`,
//       medicine.quantity,
//       medicine.minQuantity,
//       medicine.price,
//       format(new Date(medicine.expiryDate), 'yyyy-MM-dd'),
//       `"${medicine.supplier || ''}"`,
//       `"${medicine.batchNumber || ''}"`
//     ]);
    
//     return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
//   };

//   const generateIssuanceCSV = (data: any) => {
//     const headers = ['Medicine', 'Category', 'Recipient', 'Type', 'Quantity', 'Prescribed By', 'Date'];
//     const rows = data.issuances.map((issuance: any) => [
//       `"${issuance.medicineId.name}"`,
//       `"${issuance.medicineId.category}"`,
//       `"${issuance.recipientName}"`,
//       `"${issuance.issuedTo}"`,
//       issuance.quantityIssued,
//       `"${issuance.prescribedBy}"`,
//       format(new Date(issuance.issuedAt), 'yyyy-MM-dd')
//     ]);
    
//     return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
//   };

//   const generateExpiryCSV = (data: any) => {
//     const headers = ['Name', 'Category', 'Quantity', 'Expiry Date', 'Status'];
//     const allMedicines = [
//       ...data.expired.map((m: any) => ({ ...m, status: 'Expired' })),
//       ...data.expiringSoon.map((m: any) => ({ ...m, status: 'Expiring Soon' })),
//       ...data.expiringLater.map((m: any) => ({ ...m, status: 'Expiring Later' }))
//     ];
    
//     const rows = allMedicines.map((medicine: any) => [
//       `"${medicine.name}"`,
//       `"${medicine.category}"`,
//       medicine.quantity,
//       format(new Date(medicine.expiryDate), 'yyyy-MM-dd'),
//       `"${medicine.status}"`
//     ]);
    
//     return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
//   };

//   const getColorClasses = (color: string) => {
//     const colors = {
//       blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
//       green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
//       yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
//       red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
//     };
//     return colors[color as keyof typeof colors] || colors.blue;
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//           Reports & Analytics
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400">
//           Generate comprehensive reports for your pharmacy operations
//         </p>
//       </div>

//       {/* Filters */}
//       <Card>
//         <CardHeader>
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//             Report Filters
//           </h3>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Start Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.startDate}
//                 onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 End Date
//               </label>
//               <input
//                 type="date"
//                 value={filters.endDate}
//                 onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Category
//               </label>
//               <select
//                 value={filters.category}
//                 onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">All Categories</option>
//                 <option value="Antibiotics">Antibiotics</option>
//                 <option value="Painkillers">Painkillers</option>
//                 <option value="Supplements">Supplements</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 Issued To
//               </label>
//               <select
//                 value={filters.issuedTo}
//                 onChange={(e) => setFilters(prev => ({ ...prev, issuedTo: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">All Recipients</option>
//                 <option value="GIZ Guest">GIZ Guest</option>
//                 <option value="AZI Guest">AZI Guest</option>
//                 <option value="Employee">Employee</option>
//               </select>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Report Types Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {reportTypes.map((report) => (
//           <Card key={report.id} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <div className="flex items-center space-x-3">
//                 <div className={`p-3 rounded-full ${getColorClasses(report.color)}`}>
//                   <report.icon className="w-6 h-6" />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                     {report.title}
//                   </h3>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {report.description}
//                   </p>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="flex space-x-2">
//                 <Button 
//                   size="sm" 
//                   className="flex-1"
//                   onClick={() => generateReport(report.id)}
//                   loading={loading === report.id}
//                 >
//                   <FileText className="w-4 h-4 mr-2" />
//                   Generate
//                 </Button>
//                 <Button 
//                   size="sm" 
//                   variant="secondary"
//                   onClick={() => generateReport(report.id)}
//                   loading={loading === report.id}
//                 >
//                   <Download className="w-4 h-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Reports;



import React, { useState } from 'react';
import { FileText, Download, Calendar, Package, TrendingUp } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import { reportsAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Reports: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    issuedTo: ''
  });

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Complete medicine inventory with stock levels and values',
      icon: Package,
      color: 'blue'
    },
    {
      id: 'issuance',
      title: 'Issuance Report',
      description: 'Medicine dispensing records by date range and recipient type',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'expiry',
      title: 'Expiry Report',
      description: 'Medicines expiring soon and expired medicines',
      icon: Calendar,
      color: 'yellow'
    },
    {
      id: 'lowstock',
      title: 'Low Stock Report',
      description: 'Medicines below minimum stock threshold',
      icon: FileText,
      color: 'red'
    }
  ];

  const generateReport = async (reportType: string) => {
    setLoading(reportType);
    try {
      let response;

      switch (reportType) {
        case 'inventory':
          response = await reportsAPI.getInventoryReport({
            category: filters.category || undefined
          });
          break;
        case 'issuance':
          response = await reportsAPI.getIssuanceReport({
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            issuedTo: filters.issuedTo || undefined
          });

          if (!response.issuances || response.issuances.length === 0) {
            toast.error('No data found for the selected filters.');
            setLoading(null);
            return;
          }
          break;
        case 'expiry':
          response = await reportsAPI.getExpiryReport();
          break;
        case 'lowstock':
          response = await reportsAPI.getInventoryReport({ lowStock: true });
          break;
        default:
          throw new Error('Invalid report type');
      }

      // Generate and download CSV
      downloadCSV(response, reportType);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(null);
    }
  };

  const downloadCSV = (data: any, reportType: string) => {
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'inventory':
      case 'lowstock':
        csvContent = generateInventoryCSV(data);
        filename = `${reportType}_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        break;
      case 'issuance':
        csvContent = generateIssuanceCSV(data);
        filename = `issuance_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        break;
      case 'expiry':
        csvContent = generateExpiryCSV(data);
        filename = `expiry_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        break;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateInventoryCSV = (data: any) => {
    const headers = ['Name', 'Category', 'Quantity', 'Min Quantity', 'Price', 'Expiry Date', 'Supplier', 'Batch Number'];
    const rows = data.medicines.map((medicine: any) => [
      `"${medicine.name}"`,
      `"${medicine.category}"`,
      medicine.quantity,
      medicine.minQuantity,
      medicine.price,
      format(new Date(medicine.expiryDate), 'yyyy-MM-dd'),
      `"${medicine.supplier || ''}"`,
      `"${medicine.batchNumber || ''}"`
    ]);

    return [headers.join(','), ...rows.map((row: any[]) => row.join(','))
    ].join('\n');
  };

  const generateIssuanceCSV = (data: any) => {
    const headers = ['Medicine', 'Category', 'Recipient', 'Type', 'Quantity', 'Prescribed By', 'Date'];
    const rows = data.issuances.map((issuance: any) => [
      `"${issuance.medicineId.name}"`,
      `"${issuance.medicineId.category}"`,
      `"${issuance.recipientName}"`,
      `"${issuance.issuedTo}"`,
      issuance.quantityIssued,
      `"${issuance.prescribedBy}"`,
      format(new Date(issuance.issuedAt), 'yyyy-MM-dd')
    ]);

    return [headers.join(','), ...rows.map((row: any[]) => row.join(','))
    ].join('\n');
  };

  const generateExpiryCSV = (data: any) => {
    const headers = ['Name', 'Category', 'Quantity', 'Expiry Date', 'Status'];
    const allMedicines = [
      ...data.expired.map((m: any) => ({ ...m, status: 'Expired' })),
      ...data.expiringSoon.map((m: any) => ({ ...m, status: 'Expiring Soon' })),
      ...data.expiringLater.map((m: any) => ({ ...m, status: 'Expiring Later' }))
    ];

    const rows = allMedicines.map((medicine: any) => [
      `"${medicine.name}"`,
      `"${medicine.category}"`,
      medicine.quantity,
      format(new Date(medicine.expiryDate), 'yyyy-MM-dd'),
      `"${medicine.status}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
      green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
      yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300',
      red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate comprehensive reports for your pharmacy operations
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Report Filters
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Painkillers">Painkillers</option>
                <option value="Supplements">Supplements</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Issued To
              </label>
              <select
                value={filters.issuedTo}
                onChange={(e) => setFilters(prev => ({ ...prev, issuedTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Recipients</option>
                <option value="GIZ Guest">GIZ Guest</option>
                <option value="AZI Guest">AZI Guest</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${getColorClasses(report.color)}`}>
                  <report.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => generateReport(report.id)}
                  loading={loading === report.id}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Generate
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => generateReport(report.id)}
                  loading={loading === report.id}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
