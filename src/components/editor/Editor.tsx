
import React, { useState } from 'react';
import { EditorProvider, useEditor } from './EditorContext';
import EditorBlock from './EditorBlock';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EditorContent = () => {
  const { blocks, addBlock, reorderBlocks } = useEditor();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex !== index) {
      setDropTargetIndex(index);
    }
  };

  const handleDrop = () => {
    if (draggedIndex !== null && dropTargetIndex !== null && draggedIndex !== dropTargetIndex) {
      reorderBlocks(draggedIndex, dropTargetIndex);
    }
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleSave = () => {
    // In a real app, you'd save the content to a database or localStorage
    console.log('Saving editor content:', blocks);
    toast({
      title: "Content saved",
      description: "Your document has been saved successfully.",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Document Editor</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => addBlock('paragraph')}
            className="flex items-center gap-1"
          >
            <PlusCircle size={16} />
            <span>Add Block</span>
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            <span>Save</span>
          </Button>
        </div>
      </div>
      
      <Card className="border border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="editor-content">
            {blocks.map((block, index) => (
              <EditorBlock
                key={block.id}
                block={block}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Editor = () => {
  return (
    <EditorProvider>
      <EditorContent />
    </EditorProvider>
  );
};

export default Editor;
