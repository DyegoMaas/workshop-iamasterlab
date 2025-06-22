import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Copy, Zap, Target, Edit3 } from 'lucide-react';
import { useTemplates, extractVariables, renderTemplate, formatVariableName } from './hooks/useTemplates.js';
import './App.css';

function App() {
  const { templates, loading, error } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [variables, setVariables] = useState([]);
  const [values, setValues] = useState({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [isPromptEdited, setIsPromptEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFont, setSelectedFont] = useState('orbitron');
  const textareaRef = useRef(null);

  // Opções de fonte
  const fontOptions = [
    { value: 'orbitron', label: 'ORBITRON (THEME)' },
    { value: 'arial', label: 'ARIAL' },
    { value: 'roboto', label: 'ROBOTO' }
  ];



  // Função para ajustar altura da textarea automaticamente
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      // Set the height to the scrollHeight with a minimum of 250px
      const newHeight = Math.max(textarea.scrollHeight, 250);
      textarea.style.height = `${newHeight}px`;
    }
  };

  // Ajustar altura quando o prompt gerado muda
  useEffect(() => {
    if (generatedPrompt) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(adjustTextareaHeight, 0);
    }
  }, [generatedPrompt]);

  // Atualizar variáveis quando template é selecionado
  useEffect(() => {
    if (selectedTemplate) {
      const templateVars = extractVariables(selectedTemplate.content);
      setVariables(templateVars);
      
      // Resetar valores
      const newValues = {};
      templateVars.forEach(variable => {
        newValues[variable] = '';
      });
      setValues(newValues);
      setGeneratedPrompt('');
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
  };

  const handleValueChange = (variable, value) => {
    setValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const generatePrompt = () => {
    if (selectedTemplate) {
      const rendered = renderTemplate(selectedTemplate.content, values);
      setGeneratedPrompt(rendered);
      setOriginalPrompt(rendered);
      setIsPromptEdited(false); // Reset edit status when generating new prompt
    }
  };

  const handlePromptChange = (e) => {
    setGeneratedPrompt(e.target.value);
    setIsPromptEdited(e.target.value !== originalPrompt);
    // Ajustar altura quando o usuário edita o prompt
    setTimeout(adjustTextareaHeight, 0);
  };

  const resetPrompt = () => {
    setGeneratedPrompt(originalPrompt);
    setIsPromptEdited(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center doom-scanlines">
        <div className="text-center">
          <div className="text-3xl doom-title text-orange-400 doom-loading mb-4">
            <Zap className="inline-block mr-2" />
            LOADING TEMPLATES...
          </div>
          <div className="text-lg text-green-400 font-mono">
            INITIALIZING DOOM PROTOCOL
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center doom-scanlines">
        <div className="text-center doom-error">
          <div className="text-3xl doom-title text-red-500 mb-4">
            SYSTEM ERROR
          </div>
          <div className="text-lg text-red-400 font-mono">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 doom-scanlines">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl doom-title text-orange-400 mb-4">
            <Target className="inline-block mr-4" />
            IA MASTER LAB - PROMPT GENERATOR
            <Target className="inline-block ml-4" />
          </h1>
          <p className="text-xl font-mono text-green-400 tracking-wider">
            &gt; GENERATE PROMPTS FROM TEMPLATES &lt;
          </p>
          <div className="mt-4 text-sm text-gray-400 font-mono">
            [ MARS FACILITY TEMPLATE SYSTEM v2.64 ]
          </div>
        </div>

        {/* Template Selector */}
        <Card className="mb-6 doom-card">
          <CardHeader>
            <CardTitle className="doom-title text-orange-400 text-xl">
              &gt;&gt; SELECT TEMPLATE &lt;&lt;
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={handleTemplateSelect}>
              <SelectTrigger className="doom-select h-12 text-lg">
                <SelectValue placeholder="[ CHOOSE TEMPLATE PROTOCOL ]" />
              </SelectTrigger>
              <SelectContent className="doom-select">
                {templates.map(template => (
                  <SelectItem 
                    key={template.id} 
                    value={template.id}
                    className="text-green-400 focus:bg-orange-600 focus:text-black font-mono"
                  >
                    {template.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Variable Inputs */}
        {selectedTemplate && variables.length > 0 && (
          <Card className="mb-6 doom-card">
            <CardHeader>
              <CardTitle className="doom-title text-orange-400 text-xl">
                &gt;&gt; CONFIGURE PARAMETERS &lt;&lt;
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {variables.map((variable, index) => (
                <div key={variable} className="space-y-2">
                  <Label 
                    htmlFor={variable} 
                    className="doom-label text-green-400"
                  >
                    [{String(index + 1).padStart(2, '0')}] {formatVariableName(variable)}
                  </Label>
                  <Input
                    id={variable}
                    value={values[variable] || ''}
                    onChange={(e) => handleValueChange(variable, e.target.value)}
                    className="doom-input h-12 text-lg"
                    placeholder={`Enter ${formatVariableName(variable).toLowerCase()}...`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        {selectedTemplate && (
          <div className="text-center mb-8">
            <Button 
              onClick={generatePrompt}
              className="doom-button px-12 py-4 text-xl"
              disabled={variables.some(v => !values[v])}
            >
              <Zap className="mr-2" />
              GENERATE PROMPT
              <Zap className="ml-2" />
            </Button>
            {variables.some(v => !values[v]) && (
              <div className="mt-2 text-yellow-400 font-mono text-sm">
                [ WARNING: FILL ALL PARAMETERS TO PROCEED ]
              </div>
            )}
          </div>
        )}

        {/* Generated Prompt */}
        {generatedPrompt && (
          <Card className="doom-card border-green-600">
            <CardHeader>
              <CardTitle className="doom-title text-green-400 text-xl flex items-center justify-between">
                <span className="flex items-center">
                  <Edit3 className="mr-2 text-green-400" size={20} />
                  &gt;&gt; GENERATED PROMPT &lt;&lt;
                  {isPromptEdited && (
                    <span className="text-yellow-400 text-sm ml-2 font-mono">
                      [EDITED]
                    </span>
                  )}
                </span>
                <span className="text-sm font-mono text-gray-400">
                  [{generatedPrompt.length} chars | {generatedPrompt.split('\n').length} lines]
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3 text-sm text-gray-400 font-mono flex items-center justify-between">
                <div className="flex items-center">
                  <Edit3 size={14} className="mr-1" />
                  Click to edit the generated prompt
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs">FONT:</span>
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="w-48 h-10 text-xs doom-select">
                      <SelectValue placeholder="Select font..." />
                    </SelectTrigger>
                    <SelectContent className="doom-select">
                      {fontOptions.map(font => (
                        <SelectItem 
                          key={font.value} 
                          value={font.value}
                          className="text-green-400 focus:bg-orange-600 focus:text-black font-mono text-xs"
                        >
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Textarea
                ref={textareaRef}
                value={generatedPrompt}
                onChange={handlePromptChange}
                className={`doom-textarea font-${selectedFont} min-h-[250px] text-base leading-relaxed resize-none overflow-hidden`}
                placeholder="[ EDITABLE ] Your generated prompt will appear here and can be edited..."
              />
              <div className="flex gap-4 mt-6">
                <Button 
                  onClick={copyToClipboard}
                  className="doom-button flex-1"
                >
                  <Copy className="mr-2" />
                  {copied ? 'COPIED!' : 'COPY TO CLIPBOARD'}
                </Button>
                {isPromptEdited && (
                  <Button 
                    onClick={resetPrompt}
                    className="doom-button bg-orange-600 hover:bg-orange-700"
                  >
                    RESET
                  </Button>
                )}
                <Button 
                  onClick={() => {
                    setGeneratedPrompt('');
                    setOriginalPrompt('');
                    setIsPromptEdited(false);
                  }}
                  className="doom-button bg-red-600 hover:bg-red-700"
                >
                  CLEAR
                </Button>
              </div>
              {copied && (
                <div className="mt-2 text-green-400 font-mono text-sm text-center">
                  [ PROMPT COPIED TO CLIPBOARD ]
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 font-mono text-sm">
          <div>DOOM 64 PROMPT GENERATOR v1.0</div>
          <div>MARS RESEARCH FACILITY - TEMPLATE DIVISION</div>
          <div className="mt-4 text-xs text-gray-600">
            © 2024 Todos os direitos reservados para Dyego Alekssander Maas
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

