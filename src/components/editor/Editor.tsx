
import React, { useState } from 'react';
import { EditorProvider, useEditor } from './EditorContext';
import { GameProvider, useGame } from './GameContext';
import EditorBlock from './EditorBlock';
import GameSelector from './GameSelector';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, PlusCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const EditorContent = () => {
  const { blocks, addBlock, reorderBlocks } = useEditor();
  const { selectedGame, isGameRequired } = useGame();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    if (isGameRequired && !selectedGame) {
      toast({
        title: "Game selection required",
        description: "Please select a game before saving your content.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you'd save the content to a database or localStorage
    console.log('Saving editor content:', blocks, 'Game:', selectedGame);
    toast({
      title: "Content saved",
      description: "Your document has been saved successfully.",
    });
  };

  const handlePreview = () => {
    if (isGameRequired && !selectedGame) {
      toast({
        title: "Game selection required",
        description: "Please select a game before previewing your content.",
        variant: "destructive"
      });
      return;
    }
    
    // Store the current content in localStorage for the preview page
    localStorage.setItem('previewContent', JSON.stringify({
      blocks,
      game: selectedGame
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Document Editor</h2>
          <GameSelector />
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => addBlock('paragraph')}
            className="flex items-center gap-1"
            disabled={isGameRequired && !selectedGame}
          >
            <PlusCircle size={16} />
            <span>Add Block</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePreview}
            className="flex items-center gap-1"
            disabled={isGameRequired && !selectedGame}
          >
            <Eye size={16} />
            <span>Preview</span>
          </Button>
          <Button 
            variant="default" 
            onClick={handleSave}
            className="flex items-center gap-1"
            disabled={isGameRequired && !selectedGame}
          >
            <Save size={16} />
            <span>Save</span>
          </Button>
        </div>
      </div>
      
      {isGameRequired && !selectedGame ? (
        <div className="text-center p-12 border border-dashed border-muted-foreground rounded-md bg-muted/30">
          <h3 className="text-lg font-medium mb-2">Select a Game to Start</h3>
          <p className="text-muted-foreground mb-4">Choose a game from the dropdown above to begin creating content.</p>
          <GameSelector />
        </div>
      ) : (
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
      )}
    </div>
  );
};

const Editor = () => {
  return (
    <GameProvider>
      <EditorProvider>
        <EditorContent />
      </EditorProvider>
    </GameProvider>
  );
};

export default Editor;
