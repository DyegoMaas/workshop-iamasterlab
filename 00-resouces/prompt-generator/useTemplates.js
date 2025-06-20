// Hook para carregar e gerenciar templates
import { useState, useEffect } from 'react';

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        
        // Lista de templates disponíveis
        const templateFiles = [
          'creative-writing.txt',
          'expert-analysis.txt',
          'study-plan.txt',
          'marketing-strategy.txt'
        ];

        const templatePromises = templateFiles.map(async (filename) => {
          try {
            const response = await fetch(`/prompts/${filename}`);
            if (!response.ok) {
              throw new Error(`Failed to load ${filename}`);
            }
            const content = await response.text();
            
            // Extrair nome do template do filename
            const name = filename.replace('.txt', '').replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            
            return {
              id: filename.replace('.txt', ''),
              name,
              content,
              filename
            };
          } catch (err) {
            console.error(`Error loading template ${filename}:`, err);
            return null;
          }
        });

        const loadedTemplates = await Promise.all(templatePromises);
        const validTemplates = loadedTemplates.filter(template => template !== null);
        
        setTemplates(validTemplates);
        setError(null);
      } catch (err) {
        setError('Failed to load templates');
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  return { templates, loading, error };
};

// Função para extrair variáveis de um template
export const extractVariables = (templateContent) => {
  if (!templateContent) return [];
  
  const regex = /\{\{([^}]+)\}\}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(templateContent)) !== null) {
    const variable = match[1].trim();
    if (!variables.includes(variable)) {
      variables.push(variable);
    }
  }
  
  return variables;
};

// Função para renderizar template com valores
export const renderTemplate = (templateContent, values) => {
  if (!templateContent) return '';
  
  let rendered = templateContent;
  
  Object.entries(values).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    rendered = rendered.replace(regex, value || `{{${key}}}`);
  });
  
  return rendered;
};

// Função para formatar nome da variável para display
export const formatVariableName = (variable) => {
  return variable
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

