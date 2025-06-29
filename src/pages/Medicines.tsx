
// import React, { useState, useEffect } from 'react';
// import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
// import Card, { CardContent } from '../components/UI/Card';
// import Button from '../components/UI/Button';
// import Input from '../components/UI/Input';
// import Badge from '../components/UI/Badge';
// import AddMedicineModal from '../components/Modals/AddMedicineModal';
// import { medicineAPI } from '../services/api';
// import { Medicine } from '../types';
// import { format } from 'date-fns';
// import toast from 'react-hot-toast';

// const Medicines: React.FC = () => {
//   const [medicines, setMedicines] = useState<Medicine[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

// const formatPriceToPKR = (price: number) => {
//   return price.toLocaleString('en-PK', {
//     style: 'currency',
//     currency: 'PKR',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0
//   });
// };




//   const categories = [
//     'Antibiotics', 'Painkillers', 'Supplements', 'Vaccines',
//     'Antiseptics', 'Cardiovascular', 'Respiratory', 'Digestive',
//     'Neurological', 'Other'
//   ];

//   useEffect(() => {
//     fetchMedicines();
//   }, []);

//   const fetchMedicines = async () => {
//     try {
//       const response = await medicineAPI.getAll({
//         search: searchTerm,
//         category: selectedCategory
//       });
//       setMedicines(response.medicines || []);
//     } catch (error) {
//       console.error('Failed to fetch medicines:', error);
//       toast.error('Failed to load medicines');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = () => {
//     setLoading(true);
//     fetchMedicines();
//   };

//   const handleDelete = async (medicineId: string, medicineName: string) => {
//     if (window.confirm(`Are you sure you want to delete ${medicineName}?`)) {
//       try {
//         await medicineAPI.delete(medicineId);
//         toast.success('Medicine deleted successfully');
//         fetchMedicines();
//       } catch (error: any) {
//         toast.error(error.response?.data?.message || 'Failed to delete medicine');
//       }
//     }
//   };

//   const handleEdit = (medicineId: string) => {
//     const medicineToEdit = medicines.find(med => med._id === medicineId);
//     if (medicineToEdit) {
//       setSelectedMedicine(medicineToEdit);
//       setShowAddModal(true);
//     }
//   };

//   const getStockStatus = (medicine: Medicine) => {
//     if (medicine.quantity === 0) {
//       return { label: 'Out of Stock', variant: 'danger' as const };
//     } else if (medicine.isLowStock) {
//       return { label: 'Low Stock', variant: 'warning' as const };
//     } else {
//       return { label: 'In Stock', variant: 'success' as const };
//     }
//   };

//   const getExpiryStatus = (medicine: Medicine) => {
//     if (medicine.isExpired) {
//       return { label: 'Expired', variant: 'danger' as const };
//     } else if (medicine.isExpiringSoon) {
//       return { label: 'Expiring Soon', variant: 'warning' as const };
//     } else {
//       return { label: 'Valid', variant: 'success' as const };
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
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             Medicine Inventory
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             Manage your pharmacy's medicine inventory
//           </p>
//         </div>
//         <Button
//           onClick={() => {
//             setSelectedMedicine(null);
//             setShowAddModal(true);
//           }}
//           className="flex items-center space-x-2"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Add Medicine</span>
//         </Button>
//       </div>

//       <Card>
//         <CardContent>
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1">
//               <Input
//                 placeholder="Search medicines..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full"
//               />
//             </div>
//             <div className="w-full md:w-48">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => setSelectedCategory(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map(category => (
//                   <option key={category} value={category}>{category}</option>
//                 ))}
//               </select>
//             </div>
//             <Button onClick={handleSearch} className="flex items-center space-x-2">
//               <Search className="w-4 h-4" />
//               <span>Search</span>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {medicines.length > 0 ? (
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-800">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiry</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
//               {medicines.map((medicine) => {
//                 const stockStatus = getStockStatus(medicine);
//                 const expiryStatus = getExpiryStatus(medicine);

//                 return (
//                   <tr key={medicine._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{medicine.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{medicine.category}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{medicine.quantity} <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge></td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatPriceToPKR(medicine.price)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
//                       {format(new Date(medicine.expiryDate), 'MMM dd, yyyy')}
//                       <span className="ml-2">
//                         <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
//                       <Button size="sm" variant="secondary" onClick={() => handleEdit(medicine._id)}>
//                         <Edit className="w-4 h-4" />
//                       </Button>
//                       <Button size="sm" variant="danger" onClick={() => handleDelete(medicine._id, medicine.name)}>
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <Card>
//           <CardContent className="text-center py-12">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
//               No medicines found
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 mb-4">
//               Get started by adding your first medicine to the inventory.
//             </p>
//             <Button onClick={() => setShowAddModal(true)}>
//               <Plus className="w-4 h-4 mr-2" />
//               Add Medicine
//             </Button>
//           </CardContent>
//         </Card>
//       )}

//       <AddMedicineModal
//         isOpen={showAddModal}
//         onClose={() => {
//           setShowAddModal(false);
//           setSelectedMedicine(null);
//         }}
//         onSuccess={fetchMedicines}
//         selectedMedicine={selectedMedicine}
//       />
//     </div>
//   );
// };

// export default Medicines;


// ✅ FINAL VERSION of Medicines.tsx with all logic and stock handling polished
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import Card, { CardContent } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Badge from '../components/UI/Badge';
import AddMedicineModal from '../components/Modals/AddMedicineModal';
import EditMedicineModal from '../components/Modals/EditMedicineModal';
import { medicineAPI } from '../services/api';
import { Medicine } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Medicines: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const formatPriceToPKR = (price: number) => {
    return price.toLocaleString('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const categories = [
    'Antibiotics', 'Painkillers', 'Supplements', 'Vaccines',
    'Antiseptics', 'Cardiovascular', 'Respiratory', 'Digestive',
    'Neurological', 'Other'
  ];

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await medicineAPI.getAll({
        search: searchTerm,
        category: selectedCategory
      });
      setMedicines(response.medicines || []);
    } catch (error) {
      console.error('Failed to fetch medicines:', error);
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchMedicines();
  };

  const handleDelete = async (medicineId: string, medicineName: string) => {
    if (window.confirm(`Are you sure you want to delete ${medicineName}?`)) {
      try {
        await medicineAPI.delete(medicineId);
        toast.success('Medicine deleted successfully');
        fetchMedicines();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete medicine');
      }
    }
  };

  const handleEdit = (medicineId: string) => {
    const medicineToEdit = medicines.find(med => med._id === medicineId);
    if (medicineToEdit) {
      setSelectedMedicine(medicineToEdit);
      setShowEditModal(true);
    }
  };

  const getStockStatus = (medicine: Medicine) => {
    if (medicine.quantity === 0) {
      return { label: 'Out of Stock', variant: 'danger' as const };
    } else if (medicine.isLowStock) {
      return { label: 'Low Stock', variant: 'warning' as const };
    } else {
      return { label: 'In Stock', variant: 'success' as const };
    }
  };

  const getExpiryStatus = (medicine: Medicine) => {
    if (medicine.isExpired) {
      return { label: 'Expired', variant: 'danger' as const };
    } else if (medicine.isExpiringSoon) {
      return { label: 'Expiring Soon', variant: 'warning' as const };
    } else {
      return { label: 'Valid', variant: 'success' as const };
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
            Medicine Inventory
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your pharmacy's medicine inventory
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedMedicine(null);
            setShowAddModal(true);
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medicine</span>
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <Button onClick={handleSearch} className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {medicines.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Initial Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">In Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Stock Out</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {medicines.map((medicine) => {
                const stockStatus = getStockStatus(medicine);
                const expiryStatus = getExpiryStatus(medicine);
                const stockOut = (medicine.initialStock ?? 0) - (medicine.quantity ?? 0);

                return (
                  <tr key={medicine._id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{medicine.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{medicine.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{medicine.initialStock ?? '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {medicine.quantity} <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{stockOut}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{formatPriceToPKR(medicine.price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {format(new Date(medicine.expiryDate), 'MMM dd, yyyy')}
                      <span className="ml-2">
                        <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(medicine._id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(medicine._id, medicine.name)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No medicines found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by adding your first medicine to the inventory.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medicine
            </Button>
          </CardContent>
        </Card>
      )}

      <AddMedicineModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedMedicine(null);
        }}
        onSuccess={fetchMedicines}
        selectedMedicine={selectedMedicine}
      />

      <EditMedicineModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMedicine(null);
        }}
        onSuccess={fetchMedicines}
        selectedMedicine={selectedMedicine!}
      />
    </div>
  );
};

export default Medicines;
