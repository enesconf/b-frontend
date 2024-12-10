import api from './api';

export class ProjectError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ProjectError';
  }
}

export interface VideoNode {
  id: string;
  url: string;
  question?: string | null;
  text?: string | null;
  video_url?: string | null;
  answers: VideoNode[];
  sub_answers: VideoNode[];
  parent_id?: string | null;
  is_sub_question?: boolean;
}

export interface Project {
  id: string;
  name: string;
  main_video_url: string;
  user_id: string;
  nodes: VideoNode[];
}

const projectService = {
  async createProject(formData: FormData): Promise<Project> {
    try {
      const response = await api.post('/api/v1/projects', formData);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to create project',
        error.status,
        error.details
      );
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const response = await api.get('/api/v1/projects');
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to fetch projects',
        error.status,
        error.details
      );
    }
  },

  async getProject(id: string): Promise<Project> {
    try {
      const response = await api.get(`/api/v1/projects/${id}`);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to fetch project',
        error.status,
        error.details
      );
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await api.delete(`/api/v1/projects/${id}`);
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to delete project',
        error.status,
        error.details
      );
    }
  },

  async addNode(projectId: string, formData: FormData): Promise<VideoNode> {
    try {
      const response = await api.post(`/api/v1/projects/${projectId}/nodes`, formData);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to add node',
        error.status,
        error.details
      );
    }
  },

  async addAnswer(projectId: string, nodeId: string, formData: FormData): Promise<VideoNode> {
    try {
      const response = await api.post(`/api/v1/projects/${projectId}/nodes/${nodeId}/answers`, formData);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to add answer',
        error.status,
        error.details
      );
    }
  },

  async getEmbedCode(projectId: string): Promise<{ embed_code: string; allowed_domains: string[] }> {
    try {
      const response = await api.get(`/api/v1/projects/${projectId}/embed`);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to get embed code',
        error.status,
        error.details
      );
    }
  },

  async addAllowedDomain(projectId: string, formData: FormData): Promise<Project> {
    try {
      const response = await api.post(`/api/v1/projects/${projectId}/domains`, formData);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to add domain',
        error.status,
        error.details
      );
    }
  },

  async removeAllowedDomain(projectId: string, domain: string): Promise<Project> {
    try {
      const response = await api.delete(`/api/v1/projects/${projectId}/domains/${domain}`);
      return response.data;
    } catch (error: any) {
      throw new ProjectError(
        error.message || 'Failed to remove domain',
        error.status,
        error.details
      );
    }
  }
};

export default projectService; 