import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CodeEditor } from '../components/Editor';
import { executeCode } from '../lib/executor';
import { socket } from '../lib/socket';

const DEFAULT_JS = `// Start coding here
console.log("Hello World");`;

const DEFAULT_PYTHON = `# Start coding here
print("Hello World")`;

const isDefaultCode = (code: string) => code === DEFAULT_JS || code === DEFAULT_PYTHON;

export const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Initialize with JS default but can be overwritten by server state
  const [code, setCode] = useState(DEFAULT_JS);
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Prevent loops
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    socket.connect();
    
    function onConnect() {
      setIsConnected(true);
      socket.emit('join-session', id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onSessionData(data: any) {
      isRemoteUpdate.current = true;
      // Use server code if it exists, otherwise fallback to defaults based on language
      if (data.code && !data.code.startsWith('// Loading...')) { // Simple check against client initial state if meaningful
          setCode(data.code);
      } else {
         // If server sent back weird default or we want to enforce defaults on new sessions
         // Let's typically trust server, but if server code is the JS default and lang is python, we might fix it?
         // For now, trust server state.
         setCode(data.code);
      }
      setLanguage(data.language);
      if (data.output) setOutput(data.output);
      setTimeout(() => isRemoteUpdate.current = false, 100);
    }

    function onCodeUpdate(newCode: string) {
      isRemoteUpdate.current = true;
      setCode(newCode);
      setTimeout(() => isRemoteUpdate.current = false, 100);
    }

    function onLanguageUpdate(newLang: 'javascript' | 'python') {
        setLanguage(newLang);
    }
    
    function onOutputUpdate(newOutput: string) {
        setOutput(newOutput);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('session-data', onSessionData);
    socket.on('code-update', onCodeUpdate);
    socket.on('language-update', onLanguageUpdate);
    socket.on('output-update', onOutputUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('session-data', onSessionData);
      socket.off('code-update', onCodeUpdate);
      socket.off('language-update', onLanguageUpdate);
      socket.off('output-update', onOutputUpdate);
      socket.disconnect();
    };
  }, [id]);

  const handleCodeChange = (newCode: string) => {
    if (isRemoteUpdate.current) return;
    setCode(newCode);
    socket.emit('code-change', { sessionId: id, code: newCode });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLang = e.target.value as 'javascript' | 'python';
      setLanguage(newLang);
      
      // If code is currently a default, swap it to the new language default
      if (isDefaultCode(code)) {
          const newCode = newLang === 'javascript' ? DEFAULT_JS : DEFAULT_PYTHON;
          setCode(newCode);
          socket.emit('code-change', { sessionId: id, code: newCode });
      }

      socket.emit('language-change', { sessionId: id, language: newLang });
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Broadcast "Running..." status if desired, or just local
    setOutput('Running...');
    try {
      const result = await executeCode(language, code);
      setOutput(result);
      socket.emit('output-change', { sessionId: id, output: result });
    } catch (e: any) {
        const err = e.toString();
        setOutput(err);
        socket.emit('output-change', { sessionId: id, output: err });
    } finally {
      setIsRunning(false);
    }
  };
  
  const handleCopyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
  }

  return (
    <div className="interview-container">
      <header className="interview-header">
        <div className="left">
            <h2>Interview Session</h2>
            <span className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </span>
        </div>
        <div className="right">
            <button onClick={handleCopyLink} className="secondary-btn">Share Link</button>
            <select value={language} onChange={handleLanguageChange} className="lang-select">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            </select>
            <button onClick={handleRun} disabled={isRunning} className="run-btn">
            {isRunning ? 'Running...' : 'Run Code'}
            </button>
        </div>
      </header>
      <div className="main-content">
        <div className="editor-panel">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleCodeChange}
          />
        </div>
        <div className="output-panel">
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};
