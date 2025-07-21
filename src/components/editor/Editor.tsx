
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
    <div className="min-h-screen bg-gradient-subtle">
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-border/50">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Document Editor</h1>
              <p className="text-muted-foreground text-sm mt-1">Create and edit your gaming content</p>
            </div>
            <GameSelector />
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => addBlock('paragraph')}
              disabled={isGameRequired && !selectedGame}
              className="gap-2"
            >
              <PlusCircle size={16} />
              Add Block
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreview}
              disabled={isGameRequired && !selectedGame}
              className="gap-2"
            >
              <Eye size={16} />
              Preview
            </Button>
            <Button 
              variant="accent" 
              size="sm"
              onClick={handleSave}
              disabled={isGameRequired && !selectedGame}
              className="gap-2"
            >
              <Save size={16} />
              Save
            </Button>
          </div>
        </header>
        
        {/* Content */}
        {isGameRequired && !selectedGame ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center p-12 max-w-md">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Select a Game to Start</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Choose a game from the dropdown above to begin creating your content. 
                Our editor supports multiple gaming platforms with specialized modules.
              </p>
              <GameSelector />
            </div>
          </div>
        ) : (
          <main className="space-y-6">
            <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-8">
                <div className="editor-content space-y-4">
                  {blocks.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">Your document is empty</p>
                      <Button 
                        variant="outline" 
                        onClick={() => addBlock('paragraph')}
                        className="gap-2"
                      >
                        <PlusCircle size={16} />
                        Add your first block
                      </Button>
                    </div>
                  ) : (
                    <>
                      {blocks.map((block, index) => (
                        <React.Fragment key={block.id}>
                          {dropTargetIndex === index && draggedIndex !== null && draggedIndex !== index && (
                            <div className="h-1 bg-accent rounded-full animate-pulse mx-4" />
                          )}
                          <div className="group relative">
                            <EditorBlock
                              block={block}
                              index={index}
                              onDragStart={handleDragStart}
                              onDragOver={handleDragOver}
                              onDrop={handleDrop}
                              isDragging={draggedIndex === index}
                              isDropTarget={dropTargetIndex === index && draggedIndex !== index}
                            />
                          </div>
                        </React.Fragment>
                      ))}
                      {dropTargetIndex === blocks.length && draggedIndex !== null && (
                        <div className="h-1 bg-accent rounded-full animate-pulse mx-4" />
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        )}
      </div>
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
