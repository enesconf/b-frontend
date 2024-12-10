import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import projectService from '../services/project';

interface EmbedCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function EmbedCodeModal({
  isOpen,
  onClose,
  projectId
}: EmbedCodeModalProps) {
  const [embedCode, setEmbedCode] = useState('');
  const [allowedDomains, setAllowedDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && projectId) {
      fetchEmbedCode();
    }
  }, [isOpen, projectId]);

  const fetchEmbedCode = async () => {
    try {
      const response = await projectService.getEmbedCode(projectId);
      setEmbedCode(response.embed_code);
      setAllowedDomains(response.allowed_domains);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch embed code');
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain.trim()) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('domain', newDomain.trim());
      await projectService.addAllowedDomain(projectId, formData);
      setNewDomain('');
      await fetchEmbedCode();
    } catch (err: any) {
      setError(err.message || 'Failed to add domain');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    setLoading(true);
    setError('');

    try {
      await projectService.removeAllowedDomain(projectId, domain);
      await fetchEmbedCode();
    } catch (err: any) {
      setError(err.message || 'Failed to remove domain');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                    Embed Settings
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Allowed Domains Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Allowed Domains
                    </h4>
                    <form onSubmit={handleAddDomain} className="flex space-x-3 mb-4">
                      <input
                        type="text"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="example.com"
                        className="flex-1 min-w-0 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                      <button
                        type="submit"
                        disabled={loading || !newDomain.trim()}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add Domain
                      </button>
                    </form>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {allowedDomains.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center">
                          No domains added yet. Add a domain to restrict where this widget can be embedded.
                        </p>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {allowedDomains.map((domain) => (
                            <li key={domain} className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-600">{domain}</span>
                              <button
                                onClick={() => handleRemoveDomain(domain)}
                                disabled={loading}
                                className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Embed Code Section */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Embed Code
                    </h4>
                    <div className="relative">
                      <pre className="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700 whitespace-pre-wrap break-all">
                        {embedCode}
                      </pre>
                      <button
                        onClick={copyToClipboard}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                        title="Copy to clipboard"
                      >
                        {copied ? (
                          <CheckIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <ClipboardDocumentIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 