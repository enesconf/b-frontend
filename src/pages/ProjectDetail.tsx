import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  ConnectionMode,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeftIcon, PlusIcon, TrashIcon, PencilIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import VideoPlayer from '../components/VideoPlayer';
import AddQuestionModal from '../components/AddQuestionModal';
import EmbedCodeModal from '../components/EmbedCodeModal';
import projectService from '../services/project';
import type { Project, VideoNode as VideoNodeType } from '../services/project';

// Tip tanımlamaları
interface VideoNodeData {
  id: string;
  isMain: boolean;
  isAnswer?: boolean;
  url?: string;
  video_url?: string;
  question?: string | null;
  text?: string;
  onAddQuestion: () => void;
  onEditQuestion: () => void;
  onAddAnswer: () => void;
  onEditAnswer: () => void;
}

interface ExtendedVideoNode extends Omit<VideoNodeType, 'url'> {
  url?: string;
}

// Sabit stiller
const edgeStyles = {
  stroke: '#6366f1',
  strokeWidth: 3,
  strokeDasharray: '5,5',
};

// VideoNode component'i
const VideoNode: React.FC<NodeProps<VideoNodeData>> = ({ data }) => (
  <div className={`relative bg-white rounded-lg shadow-lg p-4 ${data.isMain ? 'min-w-[400px]' : 'min-w-[300px]'}`}>
    <Handle
      type="target"
      position={Position.Top}
      id={`${data.id}-target`}
      style={{ background: '#6366f1', width: '10px', height: '10px' }}
      className="!top-0"
    />

    {(data.isMain || data.video_url) && (
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <VideoPlayer url={data.isMain ? (data.url || '') : (data.video_url || '')} />
      </div>
    )}

    <div className="mt-4">
      {data.isMain ? (
        <>
          {data.question ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-900">{data.question}</h3>
                <button onClick={data.onEditQuestion} className="text-blue-600 hover:text-blue-700">
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
              <button onClick={data.onAddAnswer} className="mt-4 btn btn-secondary w-full flex items-center justify-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Answer
              </button>
            </>
          ) : (
            <button onClick={data.onAddQuestion} className="btn btn-primary w-full flex items-center justify-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Question
            </button>
          )}
        </>
      ) : data.isAnswer ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-700">{data.text}</h4>
            <button onClick={data.onEditAnswer} className="text-blue-600 hover:text-blue-700">
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
          <button onClick={data.onAddQuestion} className="mt-4 btn btn-primary w-full flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Question
          </button>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">{data.question}</h3>
            <button onClick={data.onEditQuestion} className="text-blue-600 hover:text-blue-700">
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>
          <button onClick={data.onAddAnswer} className="mt-4 btn btn-secondary w-full flex items-center justify-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Answer
          </button>
        </>
      )}
    </div>

    <Handle
      type="source"
      position={Position.Bottom}
      id={`${data.id}-source`}
      style={{ background: '#10B981', width: '10px', height: '10px' }}
      className="!bottom-0"
    />
  </div>
);

// Node tipleri
const nodeTypes = {
  videoNode: VideoNode,
};

// Ana component
const ProjectDetail: React.FC = () => {
  // State tanımlamaları
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isAnswerModal, setIsAnswerModal] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    type: 'question' | 'answer';
    data?: any;
  } | null>(null);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  // Node işleme fonksiyonu
  const processNode = useCallback((
    node: ExtendedVideoNode,
    parentId: string | null,
    isAnswer: boolean = false,
    level: number = 0,
    currentYOffset: number = 0,
    nodes: Node[] = [],
    edges: Edge[] = []
  ): number => {
    if (!node) return currentYOffset;

    const nodeId = isAnswer ? `answer-${node.id}` : node.id;
    const xPosition = level * 400;
    const yPosition = currentYOffset;

    console.log('Processing node:', {
      id: nodeId,
      parentId,
      isAnswer,
      level,
      question: node.question,
      text: node.text,
      isSubQuestion: node.is_sub_question
    });

    // Node oluşturma
    nodes.push({
      id: nodeId,
      type: 'videoNode',
      position: { x: xPosition, y: yPosition },
      data: {
        id: nodeId,
        isMain: parentId === null,
        isAnswer,
        url: node.url,
        video_url: node.video_url,
        question: node.question,
        text: node.text,
        onAddQuestion: () => {
          setSelectedNodeId(nodeId);
          setIsAnswerModal(false);
          setEditingItem(null);
          setIsModalOpen(true);
        },
        onEditQuestion: () => {
          setSelectedNodeId(nodeId);
          setIsAnswerModal(false);
          setEditingItem({ type: 'question', data: node });
          setIsModalOpen(true);
        },
        onAddAnswer: () => {
          setSelectedNodeId(nodeId);
          setIsAnswerModal(true);
          setEditingItem(null);
          setIsModalOpen(true);
        },
        onEditAnswer: () => {
          setSelectedNodeId(parentId!);
          setIsAnswerModal(true);
          setEditingItem({ type: 'answer', data: node });
          setIsModalOpen(true);
        }
      },
      className: `border-2 ${
        parentId === null
          ? 'border-indigo-500'
          : isAnswer
          ? 'border-blue-400'
          : 'border-green-400'
      }`
    });

    // Edge oluşturma
    if (parentId) {
      edges.push({
        id: `${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        sourceHandle: `${parentId}-source`,
        targetHandle: `${nodeId}-target`,
        type: 'smoothstep',
        animated: true,
        label: isAnswer ? 'Answer' : 'Question',
        labelBgStyle: { fill: '#F3F4F6' },
        labelStyle: { fill: '#374151', fontWeight: 500 },
        style: {
          ...edgeStyles,
          stroke: isAnswer ? '#6366f1' : '#10B981'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isAnswer ? '#6366f1' : '#10B981',
          width: 20,
          height: 20
        }
      });
    }

    let newYOffset = currentYOffset + 250;

    // Ana node veya soru node'ları için cevapları işle
    if (!isAnswer && node.answers && node.answers.length > 0) {
      node.answers.forEach((answer: ExtendedVideoNode) => {
        // Cevabı işle
        newYOffset = processNode(answer, nodeId, true, level + 1, newYOffset, nodes, edges);

        // Eğer cevabın sorusu varsa, yeni bir soru node'u oluştur
        if (answer.question) {
          const questionNode: ExtendedVideoNode = {
            id: `question-${answer.id}`,
            question: answer.question,
            answers: [],
            sub_answers: [],
            parent_id: `answer-${answer.id}`,
            is_sub_question: true
          };
          newYOffset = processNode(questionNode, `answer-${answer.id}`, false, level + 2, newYOffset, nodes, edges);
        }

        // Eğer alt cevaplar varsa işle
        if (answer.sub_answers && answer.sub_answers.length > 0) {
          answer.sub_answers.forEach((subAnswer: ExtendedVideoNode) => {
            newYOffset = processNode({
              ...subAnswer,
              parent_id: answer.question ? `question-${answer.id}` : `answer-${answer.id}`,
              is_sub_question: true
            }, answer.question ? `question-${answer.id}` : `answer-${answer.id}`, true, level + 3, newYOffset, nodes, edges);
          });
        }
      });
    }

    return newYOffset;
  }, []);

  // Node ve edge'leri oluşturma fonksiyonu
  const createNodesAndEdges = useCallback((project: Project) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!project.nodes || project.nodes.length === 0) {
      nodes.push({
        id: 'main',
        type: 'videoNode',
        position: { x: 0, y: 0 },
        data: {
          id: 'main',
          isMain: true,
          url: project.main_video_url,
          question: null,
          onAddQuestion: () => {
            setSelectedNodeId(null);
            setIsAnswerModal(false);
            setEditingItem(null);
            setIsModalOpen(true);
          }
        },
        className: 'border-2 border-indigo-500'
      });
      return { nodes, edges };
    }

    const mainNode = project.nodes.find(node => !node.parent_id);
    if (mainNode) {
      processNode(mainNode as ExtendedVideoNode, null, false, 0, 0, nodes, edges);
    } else {
      processNode(project.nodes[0] as ExtendedVideoNode, null, false, 0, 0, nodes, edges);
    }

    return { nodes, edges };
  }, [processNode]);

  // Proje verilerini çekme
  const fetchProject = useCallback(async () => {
    if (!id) return;

    try {
      const data = await projectService.getProject(id);
      setProject(data);
      const { nodes, edges } = createNodesAndEdges(data);
      setNodes(nodes);
      setEdges(edges);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.response?.data?.detail || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id, createNodesAndEdges, setNodes, setEdges]);

  // Event handler'lar
  const handleSuccess = useCallback(async () => {
    setIsModalOpen(false);
    setEditingItem(null);
    await fetchProject();
  }, [fetchProject]);

  const handleDeleteProject = async () => {
    if (!project || !window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(project.id);
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to delete project');
    }
  };

  // Effect hook'lar
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Loading ve error durumları
  if (loading) {
    return (
      <Layout>
        <div className="text-center">Loading project...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center">Project not found</div>
      </Layout>
    );
  }

  // Ana render
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{project?.name}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEmbedModalOpen(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CodeBracketIcon className="h-5 w-5 mr-2" />
              Embed Code
            </button>
            <button
              onClick={handleDeleteProject}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete Project
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="h-[calc(100vh-12rem)] border border-gray-200 rounded-lg bg-gray-50">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              minZoom={0.1}
              maxZoom={1.5}
              attributionPosition="bottom-left"
              connectionMode={ConnectionMode.Loose}
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: true,
                style: edgeStyles,
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#6366f1',
                  width: 20,
                  height: 20
                }
              }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>

          <AddQuestionModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
            onSuccess={handleSuccess}
            projectId={project?.id || ''}
            nodeId={selectedNodeId || undefined}
            isAnswer={isAnswerModal}
            editingItem={editingItem}
          />

          <EmbedCodeModal
            isOpen={isEmbedModalOpen}
            onClose={() => setIsEmbedModalOpen(false)}
            projectId={project?.id || ''}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail; 