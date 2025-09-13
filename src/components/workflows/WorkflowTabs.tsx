'use client';

import { Plus, X, Undo2 } from 'lucide-react';
import { Workflow } from '@/types/workflow';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { CreateWorkflowModal, WorkflowFormData } from '@/components/dashboard/CreateWorkflowModal';
import { useState } from 'react';

interface WorkflowTabsProps {
  workflows: Workflow[];
  activeWorkflow: string | null;
  onSelectWorkflow: (workflowId: string) => void;
  onCloseWorkflow: (workflowId: string) => void;
  onCreateNew: () => void;
  onCreateWithModal?: (data: WorkflowFormData) => void;
  onUndo?: () => void;
  canUndo?: boolean;
  maxWorkflows: number;
}

export function WorkflowTabs({
  workflows,
  activeWorkflow,
  onSelectWorkflow,
  onCloseWorkflow,
  onCreateNew,
  onCreateWithModal,
  onUndo,
  canUndo = false,
  maxWorkflows
}: WorkflowTabsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Debug: Check if button should be visible (can be removed in production)
  // console.log('🔍 WORKFLOW TABS RENDER:', {
  //   workflowsCount: workflows.length,
  //   maxWorkflows: maxWorkflows,
  //   shouldShowButton: workflows.length < maxWorkflows,
  //   onCreateWithModal: !!onCreateWithModal,
  //   isModalOpen: isModalOpen
  // });
  return (
    <div className="flex items-center px-4 pb-2">
      <div className="flex space-x-1 flex-1">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg cursor-pointer relative transition-colors ${
              activeWorkflow === workflow.id
                ? 'theme-bg theme-text-primary border-t-2 border-blue-500'
                : 'theme-input-bg theme-text-secondary theme-hover-bg'
            }`}
            onClick={() => onSelectWorkflow(workflow.id)}
          >
            <StatusIndicator status={workflow.status} />
            <span className="text-sm font-medium">{workflow.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseWorkflow(workflow.id);
              }}
              className="theme-text-muted hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Undo Button */}
        {onUndo && (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
              canUndo
                ? 'theme-text-secondary hover:theme-text-primary theme-hover-bg'
                : 'theme-text-muted cursor-not-allowed opacity-50'
            }`}
            title={canUndo ? 'Undo last action' : 'No actions to undo'}
          >
            <Undo2 className="w-4 h-4" />
            <span className="text-sm">Undo</span>
          </button>
        )}

        {/* New Workflow Button */}
        {workflows.length < maxWorkflows ? (
          <button
            onClick={() => {
              console.log('🚨 NEW WORKFLOW BUTTON CLICKED!');
              console.log('onCreateWithModal available:', !!onCreateWithModal);
              if (onCreateWithModal) {
                console.log('📂 Opening modal...');
                setIsModalOpen(true);
              } else {
                console.log('🔧 Using onCreateNew fallback...');
                onCreateNew();
              }
            }}
            className="flex items-center space-x-1 px-3 py-2 theme-text-secondary hover:theme-text-primary theme-hover-bg rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New Workflow</span>
          </button>
        ) : (
          <div className="text-xs text-red-500">
            Button hidden: {workflows.length} {'>='} {maxWorkflows}
          </div>
        )}
      </div>

      {/* Create Workflow Modal */}
      {onCreateWithModal ? (
        <CreateWorkflowModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={(data: WorkflowFormData) => {
            console.log('🚨 WORKFLOW TABS onSubmit CALLED!');
            console.log('Tabs received data:', data);
            console.log('Calling onCreateWithModal...');
            onCreateWithModal(data);
            console.log('✅ onCreateWithModal called, closing modal...');
            setIsModalOpen(false);
          }}
        />
      ) : (
        <div className="text-xs text-red-500">
          Modal not rendered: onCreateWithModal is {onCreateWithModal ? 'available' : 'missing'}
        </div>
      )}
    </div>
  );
}