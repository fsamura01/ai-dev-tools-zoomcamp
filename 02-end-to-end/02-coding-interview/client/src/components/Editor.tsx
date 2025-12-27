import Editor, { type OnMount } from '@monaco-editor/react';
import React from 'react';

interface CodeEditorProps {
  code: string;
  language: 'javascript' | 'python';
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, readOnly = false }) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorDidMount: OnMount = () => {
    // Optional: Add custom keybindings or theme setup here
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly: readOnly,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
