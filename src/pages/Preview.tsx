
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { EditorBlock as Block } from '@/components/editor/EditorContext';
import { Game } from '@/components/editor/GameContext';

interface PreviewContent {
  blocks: Block[];
  game: Game | null;
}

const Preview = () => {
  const [content, setContent] = useState<PreviewContent | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load content from localStorage
    const storedContent = localStorage.getItem('previewContent');
    if (storedContent) {
      try {
        setContent(JSON.parse(storedContent));
      } catch (e) {
        console.error('Failed to parse preview content', e);
      }
    }
  }, []);

  const handleReturn = () => {
    navigate('/');
  };

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4">No content to preview</h2>
          <p className="text-muted-foreground mb-6">
            There is no content available for preview. Return to the editor to create content.
          </p>
          <Button onClick={handleReturn}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Editor
          </Button>
        </div>
      </div>
    );
  }

  const { blocks, game } = content;
  
  // Renderer for different block types
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'heading-1':
        return <h1 className="text-4xl font-bold mb-6 mt-8">{block.content}</h1>;
      case 'heading-2':
        return <h2 className="text-3xl font-bold mb-4 mt-6">{block.content}</h2>;
      case 'heading-3':
        return <h3 className="text-2xl font-bold mb-3 mt-5">{block.content}</h3>;
      case 'paragraph':
        return <p className="text-lg mb-4 leading-relaxed">{block.content}</p>;
      case 'bullet-list':
        return <ul className="list-disc ml-6 mb-4"><li className="mb-2">{block.content}</li></ul>;
      case 'ordered-list':
        return <ol className="list-decimal ml-6 mb-4"><li className="mb-2">{block.content}</li></ol>;
      case 'check-list':
        return (
          <div className="flex items-start mb-2">
            <div className={`flex h-5 w-5 items-center justify-center rounded border ${block.checked ? 'bg-primary border-primary' : 'border-input'} mr-2 mt-1`}>
              {block.checked && <span className="text-white text-xs">✓</span>}
            </div>
            <span>{block.content}</span>
          </div>
        );
      case 'blockquote':
        return <blockquote className="border-l-4 border-primary pl-4 italic my-4">{block.content}</blockquote>;
      case 'code':
        return <pre className="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>{block.content}</code></pre>;
      case 'divider':
        return <hr className="my-8 border-border" />;
      case 'image':
        return (
          <figure className="my-6">
            <img 
              src={block.content || "https://placehold.co/600x400?text=Image"} 
              alt="Content" 
              className="max-w-full rounded-md"
            />
            <figcaption className="text-center text-sm text-muted-foreground mt-2">Image</figcaption>
          </figure>
        );
      case 'video':
        if (block.moduleType === 'youtube' && block.moduleData?.videoId) {
          return (
            <div className="my-6 aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${block.moduleData.videoId}`} 
                title={block.moduleData.title || "YouTube video"} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
          );
        }
        return <div className="p-4 border border-dashed rounded-md my-4 text-center">{block.moduleType} video placeholder</div>;
      case 'module':
        return (
          <div className="p-6 border rounded-md my-6 bg-muted/30">
            <div className="font-medium mb-2">{block.moduleType} Module</div>
            <p className="text-muted-foreground text-sm">Module content would render here</p>
          </div>
        );
      default:
        return <p className="mb-4">{block.content}</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with game info */}
      <header className={`py-6 ${game?.color || 'bg-primary'}`}>
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-2">
                {game && <span className="text-xs uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded">
                  {game.name}
                </span>}
                <span className="text-xs">Published: {new Date().toLocaleDateString()}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {blocks.find(b => b.type === 'heading-1')?.content || 'Untitled Document'}
              </h1>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleReturn}
              className="flex items-center gap-1"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Content */}
      <main className="container max-w-4xl mx-auto py-12 px-4">
        <article className="prose lg:prose-xl dark:prose-invert max-w-none">
          {blocks.map((block, index) => (
            <React.Fragment key={block.id || index}>
              {renderBlock(block)}
            </React.Fragment>
          ))}
        </article>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-6 mt-10">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">
              Content powered by TextCraft Modulator
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReturn}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Preview;
