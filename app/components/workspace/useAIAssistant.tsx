'use client';

import { useState } from 'react';

interface AIAssistantState {
  isLoading: boolean;
  error: string | null;
}

export interface AIAssistantResponse {
  text: string;
  sources?: {
    title: string;
    url: string;
    snippet: string;
  }[];
  suggestions?: string[];
}

// Helper function to generate responses based on context
const generateContextualResponse = async (
  prompt: string, 
  context?: { 
    workspaceId?: string | null;
    projectId?: string | null;
    resources?: any[];
  }
): Promise<AIAssistantResponse> => {
  // In a production environment, this would make an API call to your AI service
  
  // For demo purposes, we'll simulate different responses based on the prompt
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const lowerPrompt = prompt.toLowerCase();
  
  // Check for common patterns in the prompt
  if (lowerPrompt.includes('hello') || lowerPrompt.includes('hi') || lowerPrompt.includes('hey')) {
    return {
      text: "Hello! I'm your Ecosyz AI assistant. How can I help you with your workspace today?",
      suggestions: [
        "Show me my recent resources",
        "Summarize my project notes",
        "Help me create a new workspace"
      ]
    };
  }
  
  if (lowerPrompt.includes('create') && (lowerPrompt.includes('workspace') || lowerPrompt.includes('project'))) {
    return {
      text: "I can help you create a new workspace or project. Would you like me to guide you through the process?",
      suggestions: [
        "Create a new workspace",
        "Add a project to current workspace",
        "Tell me about workspace organization"
      ]
    };
  }
  
  if (lowerPrompt.includes('resource') || lowerPrompt.includes('document') || lowerPrompt.includes('file')) {
    return {
      text: `I can help you manage resources in your workspace${context?.workspaceId ? ' "' + context.workspaceId + '"' : ''}. You can upload documents, add links, or create notes directly in the workspace.`,
      suggestions: [
        "Upload a document",
        "Add a web link",
        "Create a note"
      ]
    };
  }

  if (lowerPrompt.includes('summarize') || lowerPrompt.includes('summary')) {
    return {
      text: "I can summarize documents or web content for you. Please provide the URL or upload the document you'd like me to summarize.",
      suggestions: [
        "Summarize a web page",
        "Summarize my recent notes",
        "Generate a project summary"
      ]
    };
  }
  
  if (lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('develop')) {
    return {
      text: "I can help with programming questions or provide code examples. What specifically are you trying to build or understand?",
      sources: [
        {
          title: "Ecosyz Developer Documentation",
          url: "/docs/developer",
          snippet: "API reference and developer guides for integrating with Ecosyz"
        }
      ],
      suggestions: [
        "Show me JavaScript examples",
        "Help with React components",
        "Explain API integration"
      ]
    };
  }

  // Default response
  return {
    text: `I'm here to help with your workspace needs. You can ask me about your resources, projects, or how to use Ecosyz features.${context?.workspaceId ? " Currently, you're in workspace: " + context.workspaceId : ""}`,
    suggestions: [
      "What can you do?",
      "How to organize my workspace?",
      "Search my resources"
    ]
  };
};

export const useAIAssistant = () => {
  const [state, setState] = useState<AIAssistantState>({
    isLoading: false,
    error: null
  });

  // The main function to query the AI assistant
  const queryAssistant = async (
    prompt: string,
    context?: {
      workspaceId?: string | null;
      projectId?: string | null;
      resources?: any[];
    }
  ): Promise<AIAssistantResponse> => {
    try {
      setState({ isLoading: true, error: null });
      
      // Call the AI service
      const response = await generateContextualResponse(prompt, context);
      
      setState({ isLoading: false, error: null });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState({ isLoading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    ...state,
    queryAssistant
  };
};

// Create a context-aware implementation
export const createWorkspaceAssistant = (workspaceId?: string | null, projectId?: string | null) => {
  const { queryAssistant, isLoading, error } = useAIAssistant();
  
  const askQuestion = async (prompt: string) => {
    return queryAssistant(prompt, { workspaceId, projectId });
  };
  
  return {
    askQuestion,
    isLoading,
    error
  };
};