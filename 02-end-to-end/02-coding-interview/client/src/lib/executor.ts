export const executeCode = async (language: 'javascript' | 'python', code: string): Promise<string> => {
  if (language === 'python') {
    return runPython(code);
  } else {
    return runJavascript(code);
  }
};

let pyodide: any = null;

const runPython = async (code: string): Promise<string> => {
  if (!pyodide) {
    // @ts-ignore
    pyodide = await loadPyodide();
  }
  try {
    // Redirect stdout
    pyodide.setStdout({ batched: (msg: string) => console.log(msg) });
    // We capture stdout by hijacking it or using pyodide.runPython's return if it returns something.
    // Better: use pyodide.runPythonAsync and capture stdout via a custom printer if possible,
    // but for simplicity we'll just return the result of the expression or handle print via a detailed implementation if needed.
    // For now, let's just return the result of the last expression.
    // To capture prints, we need to setup a buffer.
    
    let outputBuffer: string[] = [];
    pyodide.setStdout({ batched: (msg: string) => outputBuffer.push(msg) });
    
    await pyodide.runPythonAsync(code);
    return outputBuffer.join('\n');
  } catch (err: any) {
    return err.toString();
  }
};

const runJavascript = (code: string): Promise<string> => {
  return new Promise((resolve) => {
    // Use an iframe for sandboxing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Add a message listener
    const handleMessage = (event: MessageEvent) => {
      // Check origin... but we are null origin
      if (event.source === iframe.contentWindow) {
        resolve(event.data.output || event.data.error);
        window.removeEventListener('message', handleMessage);
        document.body.removeChild(iframe);
      }
    };
    window.addEventListener('message', handleMessage);


    (iframe.contentWindow as any)?.eval(`
      const logs = [];
      const stringify = (val) => {
        if (val instanceof Map) {
          const entries = Array.from(val.entries())
            .map(([k, v]) => stringify(k) + '=>' + stringify(v))
            .join(', ');
          return '{ ' + entries + ' }';
        }
        if (val instanceof Set) {
          const items = Array.from(val).map(stringify).join(', ');
          return 'Set { ' + items + ' }';
        }
        if (typeof val === 'string') {
          return '"' + val + '"';
        }
        if (typeof val === 'object' && val !== null) {
          if (Array.isArray(val)) {
             return '[' + val.map(stringify).join(', ') + ']';
          }
          try {
            const entries = Object.entries(val)
              .map(([k, v]) => k + ': ' + stringify(v))
              .join(', ');
            return '{ ' + entries + ' }';
          } catch (e) {
            return String(val);
          }
        }
        return String(val);
      };
      console.log = (...args) => logs.push(args.map(stringify).join(' '));
      console.error = (...args) => logs.push('ERROR: ' + args.map(stringify).join(' '));
      console.warn = (...args) => logs.push('WARN: ' + args.map(stringify).join(' '));
      
      try {
        const result = eval(${JSON.stringify(code)});
        const output = logs.join('\\n') + (logs.length > 0 && result !== undefined ? '\\n' : '') + (result !== undefined ? stringify(result) : '');
        parent.postMessage({ output }, '*');
      } catch(e) {
        parent.postMessage({ error: e.toString() }, '*');
      }
    `);
  });
};
