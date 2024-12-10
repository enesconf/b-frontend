import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import projectService, { ProjectError } from '../services/project';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormError {
  field?: string;
  message: string;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const form = e.currentTarget;
      const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement;
      const name = nameInput.value.trim();

      // Validate form data
      if (!name) {
        setError({ field: 'name', message: 'Please enter a project name' });
        return;
      }

      if (!selectedFile) {
        setError({ field: 'video', message: 'Please select a video file' });
        return;
      }

      // Log file details before upload
      console.log('File details:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });

      if (!selectedFile.type.startsWith('video/')) {
        setError({ field: 'video', message: 'Please select a valid video file' });
        return;
      }

      // Create FormData and append fields
      const formData = new FormData();
      formData.append('name', name);
      
      if (selectedFile) {
        // Ensure the file is appended with the correct field name
        formData.append('video', selectedFile, selectedFile.name);
      }

      // Debug log
      console.log('Form data entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value instanceof File ? `File(${value.name}, ${value.type})` : value}`);
      }

      try {
        const response = await projectService.createProject(formData);
        console.log('Project created:', response);
        onSuccess();
        onClose();
      } catch (error: any) {
        console.error('API Error:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          setError({ message: error.response.data.detail || 'Failed to create project' });
        } else {
          setError({ message: 'Failed to create project' });
        }
        return;
      }
    } catch (err) {
      console.error('Form submission error:', err);
      
      if (err instanceof ProjectError) {
        setError({ message: err.message });
      } else {
        setError({ message: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    
    if (!file) {
      setSelectedFile(null);
      setError({ field: 'video', message: 'Please select a video file' });
      return;
    }

    console.log('Selected file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    if (!file.type.startsWith('video/')) {
      setSelectedFile(null);
      setError({ field: 'video', message: 'Please select a valid video file' });
      return;
    }

    setSelectedFile(file);
  };

  const getFieldError = (field: string) => {
    return error?.field === field ? error.message : '';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="div" className="flex justify-between items-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Create New Project
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {error && !error.field && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error.message}</div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className={`mt-1 input ${getFieldError('name') ? 'border-red-500' : ''}`}
                      placeholder="Enter project name"
                    />
                    {getFieldError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                      Main Video
                    </label>
                    <input
                      type="file"
                      name="video"
                      id="video"
                      accept="video/*"
                      required
                      onChange={handleFileChange}
                      className={`mt-1 block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        ${getFieldError('video') ? 'border-red-500' : ''}`}
                    />
                    {getFieldError('video') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('video')}</p>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        'Create Project'
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 