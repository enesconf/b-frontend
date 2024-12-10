import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import projectService from '../services/project';

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  nodeId?: string;
  isAnswer?: boolean;
  editingItem?: {
    type: 'question' | 'answer';
    data?: any;
  } | null;
}

export default function AddQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  nodeId,
  isAnswer,
  editingItem
}: AddQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [text, setText] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingItem) {
      if (editingItem.type === 'question') {
        setQuestion(editingItem.data.question || '');
      } else {
        setText(editingItem.data.text || '');
      }
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (isAnswer) {
        formData.append('text', text);
        if (video) {
          formData.append('video', video);
        }
        await projectService.addAnswer(projectId, nodeId!, formData);
      } else {
        formData.append('question', question);
        if (nodeId) {
          formData.append('parent_id', nodeId);
          formData.append('is_sub_question', 'true');
        } else {
          formData.append('parent_id', '');
          formData.append('is_sub_question', 'false');
        }
        await projectService.addNode(projectId, formData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to add question/answer');
    } finally {
      setLoading(false);
    }
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {isAnswer ? 'Add Answer' : 'Add Question'}
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isAnswer ? (
                    <>
                      <div>
                        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                          Answer Text
                        </label>
                        <textarea
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="video" className="block text-sm font-medium text-gray-700">
                          Video (Optional)
                        </label>
                        <input
                          type="file"
                          id="video"
                          accept="video/*"
                          onChange={(e) => setVideo(e.target.files?.[0] || null)}
                          className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                        Question
                      </label>
                      <input
                        type="text"
                        id="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  )}

                  {error && (
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </span>
                      ) : (
                        'Add'
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