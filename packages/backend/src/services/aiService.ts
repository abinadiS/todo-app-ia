import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { openai } from '@ai-sdk/openai';
import type { Task } from '@prisma/client';
import { AIProviderError } from '../utils/errors';
import { logger } from '../utils/logger';
import { config } from '../config';

export interface TaskSummaryResult {
  summary: string;
  totalPending: number;
  estimatedTime?: string;
}

export interface PrioritySuggestion {
  taskId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reason: string;
}

export interface DescriptionCompletion {
  description: string;
  confidence: number;
}

export class AIService {
  // Seleccionar modelo basado en AI_PROVIDER (openai o gemini)
  private provider = config.AI_PROVIDER;

  private get model() {
    return this.provider === 'openai'
      ? openai('gpt-4o-mini')
      : google('gemini-2.0-flash');
  }

  // Limpiar respuesta de markdown code blocks
  private cleanJsonResponse(text: string): string {
    return text
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();
  }

  async generateTaskSummary(tasks: Task[]): Promise<TaskSummaryResult> {
    if (tasks.length === 0) {
      return {
        summary: 'No hay tareas pendientes. ¡Estás al día!',
        totalPending: 0,
      };
    }

    try {
      const taskList = tasks
        .map((t) => `- ${t.title}${t.description ? `: ${t.description}` : ''}`)
        .join('\n');

      const { text } = await generateText({
        model: this.model,
        prompt: `Analiza estas tareas pendientes y genera una respuesta JSON con un resumen y tiempo estimado. Responde siempre en español.

Tareas:
${taskList}

Responde SOLO con JSON válido en este formato:
{
  "summary": "Resumen breve de 2-3 oraciones sobre lo que hay que hacer",
  "estimatedTime": "Tiempo total estimado como '2-3 horas' o '1 día'"
}`,
      });

      const result = JSON.parse(this.cleanJsonResponse(text));
      return {
        summary: result.summary,
        totalPending: tasks.length,
        estimatedTime: result.estimatedTime,
      };
    } catch (error) {
      logger.error('AI Summary generation failed:', error);
      throw new AIProviderError(
        this.provider,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async suggestPriorities(tasks: Task[]): Promise<PrioritySuggestion[]> {
    if (tasks.length === 0) {
      return [];
    }

    try {
      const taskList = tasks
        .map((t, i) => `${i}. [ID: ${t.id}] ${t.title}${t.description ? `: ${t.description}` : ''}`)
        .join('\n');

      const { text } = await generateText({
        model: this.model,
        prompt: `Analiza estas tareas y sugiere prioridades (LOW, MEDIUM, HIGH, URGENT) basándote en:
- Indicadores de urgencia en el título/descripción
- Dependencias o bloqueos mencionados
- Impacto en el negocio

Responde siempre en español.

Tareas:
${taskList}

Responde SOLO con un array JSON válido:
[
  { "index": 0, "priority": "HIGH", "reason": "Razón breve en español" }
]`,
      });

      const result = JSON.parse(this.cleanJsonResponse(text));
      return result.map((p: { index: number; priority: string; reason: string }) => ({
        taskId: tasks[p.index].id,
        priority: p.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        reason: p.reason,
      }));
    } catch (error) {
      logger.error('AI Priority suggestion failed:', error);
      throw new AIProviderError(
        this.provider,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async completeDescription(title: string): Promise<DescriptionCompletion> {
    try {
      const { text } = await generateText({
        model: this.model,
        prompt: `Dado este título de tarea, genera una descripción útil (2-4 oraciones) que aclare lo que hay que hacer. Responde siempre en español.

Título: "${title}"

Responde SOLO con JSON válido:
{
  "description": "Descripción detallada de la tarea en español",
  "confidence": 0.8
}

El confidence debe ser 0.0-1.0 basado en qué tan claro era el título.`,
      });

      return JSON.parse(this.cleanJsonResponse(text));
    } catch (error) {
      logger.error('AI Description completion failed:', error);
      throw new AIProviderError(
        this.provider,
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
