import React, { useEffect, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { TaxTable } from './components/TaxTable';
import { EditModal } from './components/EditModal';
import { fetchTaxes, fetchCountries, updateTaxRecord } from './services/api';
import { TaxRecord, Country } from './types';

const App: React.FC = () => {
  const [taxes, setTaxes] = useState<TaxRecord[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TaxRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch both resources in parallel for performance
      const [taxesData, countriesData] = await Promise.all([
        fetchTaxes(),
        fetchCountries(),
      ]);
      setTaxes(taxesData);
      setCountries(countriesData);
      setIsError(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEdit = (record: TaxRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  const handleSave = async (id: string, name: string, country: string) => {
    setIsSaving(true);
    try {
      const updatedRecord = await updateTaxRecord(id, { name, country });
      
      // Optimistically update the local state to reflect changes immediately
      setTaxes((prevTaxes) => 
        prevTaxes.map((t) => (t.id === id ? updatedRecord : t))
      );
      
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save:', error);
      throw error; // Propagate to modal to show error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Inkle Assignment</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tax Records</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view tax details by country.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300">
              Total Records: {taxes.length}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-500">Loading data...</p>
          </div>
        ) : isError ? (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-center">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <p className="mt-2 text-sm text-red-700">There was a problem fetching the tax records. Please try refreshing the page.</p>
            <button 
              onClick={loadData}
              className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Retry
            </button>
          </div>
        ) : (
          <TaxTable data={taxes} onEdit={handleEdit} />
        )}
      </main>

      {/* Modals */}
      <EditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialData={editingRecord}
        countries={countries}
        isSaving={isSaving}
      />
    </div>
  );
};

export default App;