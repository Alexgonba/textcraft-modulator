
import Editor from '@/components/editor/Editor';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-6 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            TextCraft Modulator
          </h1>
          <p className="text-muted-foreground">
            A modern, extensible text editor with modular capabilities for multiple games
          </p>
        </div>
      </header>
      
      <main className="container max-w-5xl mx-auto py-8 px-4">
        <Editor />
      </main>
      
      <footer className="border-t border-border py-6 mt-10 bg-muted/20">
        <div className="container max-w-5xl mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>TextCraft Modulator - Built with React, Typescript, and ShadCN UI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
