// import React, { useState } from 'react';
// import { X } from 'lucide-react';
// import Button from '../UI/Button';
// import Input from '../UI/Input';
// import Select from '../UI/Select';
// import { medicineAPI } from '../../services/api';
// import toast from 'react-hot-toast';

// interface AddMedicineModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     quantity: '',
//     minQuantity: '',
//     price: '',
//     expiryDate: '',
//     supplier: '',
//     batchNumber: '',
//     barcode: '',
//     description: ''
//   });

//   const categories = [
//     { value: '', label: 'Select Category' },
//     { value: 'Antibiotics', label: 'Antibiotics' },
//     { value: 'Painkillers', label: 'Painkillers' },
//     { value: 'Supplements', label: 'Supplements' },
//     { value: 'Vaccines', label: 'Vaccines' },
//     { value: 'Antiseptics', label: 'Antiseptics' },
//     { value: 'Cardiovascular', label: 'Cardiovascular' },
//     { value: 'Respiratory', label: 'Respiratory' },
//     { value: 'Digestive', label: 'Digestive' },
//     { value: 'Neurological', label: 'Neurological' },
//     { value: 'Other', label: 'Other' }
//   ];

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await medicineAPI.create({
//         ...formData,
//         quantity: parseInt(formData.quantity),
//         minQuantity: parseInt(formData.minQuantity),
//         price: parseFloat(formData.price),
//         expiryDate: new Date(formData.expiryDate)
//       });

//       toast.success('Medicine added successfully');
//       onSuccess();
//       onClose();
      
//       // Reset form
//       setFormData({
//         name: '',
//         category: '',
//         quantity: '',
//         minQuantity: '',
//         price: '',
//         expiryDate: '',
//         supplier: '',
//         batchNumber: '',
//         barcode: '',
//         description: ''
//       });
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to add medicine');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//             Add New Medicine
//           </h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Medicine Name *"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Enter medicine name"
//               required
//             />

//             <Select
//               label="Category *"
//               name="category"
//               value={formData.category}
//               onChange={handleInputChange}
//               options={categories}
//               required
//             />

//             <Input
//               label="Quantity *"
//               type="number"
//               name="quantity"
//               value={formData.quantity}
//               onChange={handleInputChange}
//               placeholder="Enter quantity"
//               min="0"
//               required
//             />

//             <Input
//               label="Minimum Quantity *"
//               type="number"
//               name="minQuantity"
//               value={formData.minQuantity}
//               onChange={handleInputChange}
//               placeholder="Enter minimum quantity"
//               min="1"
//               required
//             />

//             <Input
//               label="Price *"
//               type="number"
//               step="0.01"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//               placeholder="Enter price"
//               min="0"
//               required
//             />

//             <Input
//               label="Expiry Date *"
//               type="date"
//               name="expiryDate"
//               value={formData.expiryDate}
//               onChange={handleInputChange}
//               required
//             />

//             <Input
//               label="Supplier"
//               name="supplier"
//               value={formData.supplier}
//               onChange={handleInputChange}
//               placeholder="Enter supplier name"
//             />

//             <Input
//               label="Batch Number"
//               name="batchNumber"
//               value={formData.batchNumber}
//               onChange={handleInputChange}
//               placeholder="Enter batch number"
//             />

//             <Input
//               label="Barcode"
//               name="barcode"
//               value={formData.barcode}
//               onChange={handleInputChange}
//               placeholder="Enter barcode"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               rows={3}
//               className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
//               placeholder="Enter medicine description..."
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button type="button" variant="secondary" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" loading={loading}>
//               Add Medicine
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddMedicineModal;


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Select from '../UI/Select';
import { medicineAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { Medicine } from '../../types';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedMedicine: Medicine | null;
}

type FormData = {
  name: string;
  category: Medicine['category'] | '';
  quantity: string;
  minQuantity: string;
  price: string;
  expiryDate: string;
  supplier: string;
  batchNumber: string;
  barcode: string;
  description: string;
  initialStock: string;
  stockToAdd?: string;
};

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedMedicine
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    quantity: '',
    minQuantity: '',
    price: '',
    expiryDate: '',
    supplier: '',
    batchNumber: '',
    barcode: '',
    description: '',
    initialStock: '',
    stockToAdd: ''
  });

  useEffect(() => {
    if (selectedMedicine) {
      setFormData({
        name: selectedMedicine.name || '',
        category: selectedMedicine.category || '',
        quantity: selectedMedicine.quantity?.toString() || '',
        minQuantity: selectedMedicine.minQuantity?.toString() || '',
        price: selectedMedicine.price?.toString() || '',
        expiryDate: selectedMedicine.expiryDate?.split('T')[0] || '',
        supplier: selectedMedicine.supplier || '',
        batchNumber: selectedMedicine.batchNumber || '',
        barcode: selectedMedicine.barcode || '',
        description: selectedMedicine.description || '',
        initialStock: selectedMedicine.initialStock?.toString() || '',
        stockToAdd: ''
      });
    } else {
      setFormData({
        name: '',
        category: '',
        quantity: '',
        minQuantity: '',
        price: '',
        expiryDate: '',
        supplier: '',
        batchNumber: '',
        barcode: '',
        description: '',
        initialStock: '',
        stockToAdd: ''
      });
    }
  }, [selectedMedicine]);

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'Antibiotics', label: 'Antibiotics' },
    { value: 'Painkillers', label: 'Painkillers' },
    { value: 'Supplements', label: 'Supplements' },
    { value: 'Vaccines', label: 'Vaccines' },
    { value: 'Antiseptics', label: 'Antiseptics' },
    { value: 'Cardiovascular', label: 'Cardiovascular' },
    { value: 'Respiratory', label: 'Respiratory' },
    { value: 'Digestive', label: 'Digestive' },
    { value: 'Neurological', label: 'Neurological' },
    { value: 'Other', label: 'Other' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Partial<Medicine> = {
        name: formData.name,
        category: formData.category as Medicine['category'],
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity),
        price: parseFloat(formData.price),
        expiryDate: new Date(formData.expiryDate),
        supplier: formData.supplier,
        batchNumber: formData.batchNumber,
        barcode: formData.barcode,
        description: formData.description,
        initialStock: parseInt(formData.initialStock)
      };

      if (selectedMedicine) {
        await medicineAPI.update(selectedMedicine._id, payload);
        toast.success('Medicine updated successfully');
      } else {
        await medicineAPI.create(payload);
        toast.success('Medicine added successfully');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {selectedMedicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Medicine Name *"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter medicine name"
              required
            />

            <Select
              label="Category *"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categories}
              required
            />

            <Input
              label="Quantity *"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="0"
              required
            />

            <Input
              label="Minimum Quantity *"
              type="number"
              name="minQuantity"
              value={formData.minQuantity}
              onChange={handleInputChange}
              placeholder="Enter minimum quantity"
              min="1"
              required
            />

            <Input
              label="Price *"
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              min="0"
              required
            />

            <Input
              label="Expiry Date *"
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              placeholder="Enter supplier name"
            />

            <Input
              label="Batch Number"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleInputChange}
              placeholder="Enter batch number"
            />

            <Input
              label="Barcode"
              name="barcode"
              value={formData.barcode}
              onChange={handleInputChange}
              placeholder="Enter barcode"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter medicine description..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {selectedMedicine ? 'Update Medicine' : 'Add Medicine'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
