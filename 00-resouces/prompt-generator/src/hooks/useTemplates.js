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
        
        // Carregar manifest com lista de templates
        const manifestResponse = await fetch('/prompts/manifest.json');
        if (!manifestResponse.ok) {
          throw new Error('Failed to load templates manifest');
        }
        
        const manifest = await manifestResponse.json();
        const templateFiles = manifest.templates || [];

        const templatePromises = templateFiles.map(async (templateInfo) => {
          try {
            const response = await fetch(`/prompts/${templateInfo.filename}`);
            if (!response.ok) {
              throw new Error(`Failed to load ${templateInfo.filename}`);
            }
            const content = await response.text();
            
            return {
              id: templateInfo.id,
              name: templateInfo.name,
              content,
              filename: templateInfo.filename
            };
          } catch (err) {
            console.error(`Error loading template ${templateInfo.filename}:`, err);
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

