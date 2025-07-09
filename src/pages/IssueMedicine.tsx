
import React, { useState, useEffect } from 'react';
import { Search, Package, FileText } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';
import { medicineAPI, issuanceAPI } from '../services/api';
import { Medicine } from '../types';
import toast from 'react-hot-toast';

const getExpiryStatusText = (expiryDate: Date | string) => {
  const today = new Date();
  const expDate = new Date(expiryDate);
  const diffInDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  if (diffInDays < 0) return '❌ Expired';
  if (diffInDays <= 30) return '⚠️ Expiring Soon';
  return '✅ Valid';
};

const getExpiryStatusColor = (expiryDate: Date | string) => {
  const today = new Date();
  const expDate = new Date(expiryDate);
  const diffInDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  if (diffInDays < 0) return 'text-red-600';
  if (diffInDays <= 30) return 'text-yellow-500';
  return 'text-green-600';
};

const IssueMedicine: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [selectedMedicines, setSelectedMedicines] = useState<{ medicine: Medicine, quantity: number }[]>([]);
  const [currentQuantity, setCurrentQuantity] = useState('');

  const [formData, setFormData] = useState({
    issuedTo: '',
    recipientName: '',
    recipientID: '',
    prescribedBy: '',
    notes: ''
  });

  const recipientTypes = [
    { value: '', label: 'Select recipient type' },
    { value: 'GIZ Guest', label: 'GIZ Guest' },
    { value: 'AZI Guest', label: 'AZI Guest' },
    { value: 'Employee', label: 'Employee' }
  ];

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchMedicines();
    } else {
      setMedicines([]);
    }
  }, [searchTerm]);

  const searchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineAPI.getAll({ search: searchTerm, limit: 10 });
      setMedicines(response.medicines || []);
    } catch (error) {
      console.error('Failed to search medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMedicineSelect = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setSearchTerm(medicine.name);
    setMedicines([]);
    setCurrentQuantity('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMedicines.length === 0) {
      toast.error('Please add at least one medicine with quantity');
      return;
    }

    try {
      setIssuing(true);

      await issuanceAPI.create({
        issuedMedicines: selectedMedicines.map(item => ({
          medicineId: item.medicine._id,
          quantityIssued: item.quantity
        })),
        ...formData
      });

      toast.success('Medicines issued successfully');

      setFormData({
        issuedTo: '',
        recipientName: '',
        recipientID: '',
        prescribedBy: '',
        notes: ''
      });
      setSelectedMedicines([]);
      setSelectedMedicine(null);
      setSearchTerm('');
      setCurrentQuantity('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to issue medicines');
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issue Medicine</h1>
        <p className="text-gray-600 dark:text-gray-400">Issue medicines to patients and track dispensing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Medicine Search and Selection */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Medicines</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search medicine by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {loading && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}

              {medicines.map((medicine) => (
                <button
                  key={medicine._id}
                  onClick={() => handleMedicineSelect(medicine)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{medicine.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {medicine.category} • Stock: {medicine.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">PKR {medicine.price}</p>
                      <p className={`text-xs font-semibold ${getExpiryStatusColor(medicine.expiryDate)}`}>
                        {getExpiryStatusText(medicine.expiryDate)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {selectedMedicine && (
              <div className="space-y-2">
                <Input
                  label="Quantity to Issue"
                  type="number"
                  name="quantityIssued"
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  min="1"
                  max={selectedMedicine?.quantity || 1}
                  required
                />
                <Button
                  type="button"
                  onClick={() => {
                    const quantityNum = parseInt(currentQuantity);
                    if (!quantityNum || quantityNum <= 0) {
                      toast.error("Please enter a valid quantity.");
                      return;
                    }

                    if (quantityNum > selectedMedicine.quantity) {
                      toast.error(`Insufficient stock. Available: ${selectedMedicine.quantity}`);
                      return;
                    }

                    setSelectedMedicines(prev => [...prev, { medicine: selectedMedicine, quantity: quantityNum }]);
                    setSelectedMedicine(null);
                    setSearchTerm('');
                    setCurrentQuantity('');
                  }}
                >
                  Add Medicine to List
                </Button>
              </div>
            )}

            {selectedMedicines.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white">Medicines to be Issued:</h4>
                {selectedMedicines.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded shadow border border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.medicine.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMedicines(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issue Details</h3>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Issue To"
                name="issuedTo"
                value={formData.issuedTo}
                onChange={handleInputChange}
                options={recipientTypes}
                required
              />

              <Input
                label="Recipient Name"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                placeholder="Enter recipient's full name"
                required
              />

              <Input
                label="Recipient ID"
                name="recipientID"
                value={formData.recipientID}
                onChange={handleInputChange}
                placeholder="Enter recipient's ID number"
                required
              />

              <Input
                label="Prescribed By"
                name="prescribedBy"
                value={formData.prescribedBy}
                onChange={handleInputChange}
                placeholder="Enter doctor's name"
                required
              />

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                loading={issuing}
                disabled={selectedMedicines.length === 0 || !formData.issuedTo || !formData.recipientName}
              >
                Issue Medicine
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IssueMedicine;
