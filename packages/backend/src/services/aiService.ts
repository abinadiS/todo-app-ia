import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import type { Task } from '@prisma/client';
import { AIProviderError } from '../utils/errors';
import { logger } from '../utils/logger';

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
  // Usar la funcion google() para crear el modelo - segun AI SDK docs
  private model = google('gemini-2.0-flash');

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
        summary: 'No pending tasks. You are all caught up!',
        totalPending: 0,
      };
    }

    try {
      const taskList = tasks
        .map((t) => `- ${t.title}${t.description ? `: ${t.description}` : ''}`)
        .join('\n');

      const { text } = await generateText({
        model: this.model,
        prompt: `Analyze these pending tasks and generate a JSON response with a summary and estimated time.

Tasks:
${taskList}

Respond ONLY with valid JSON in this format:
{
  "summary": "Brief 2-3 sentence summary of what needs to be done",
  "estimatedTime": "Estimated total time like '2-3 hours' or '1 day'"
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
        'google',
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
        prompt: `Analyze these tasks and suggest priorities (LOW, MEDIUM, HIGH, URGENT) based on:
- Urgency indicators in the title/description
- Dependencies or blockers mentioned
- Business impact

Tasks:
${taskList}

Respond ONLY with valid JSON array:
[
  { "index": 0, "priority": "HIGH", "reason": "Brief reason" }
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
        'google',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async completeDescription(title: string): Promise<DescriptionCompletion> {
    try {
      const { text } = await generateText({
        model: this.model,
        prompt: `Given this task title, generate a helpful task description (2-4 sentences) that clarifies what needs to be done.

Title: "${title}"

Respond ONLY with valid JSON:
{
  "description": "Detailed task description",
  "confidence": 0.8
}

The confidence should be 0.0-1.0 based on how clear the title was.`,
      });

      return JSON.parse(this.cleanJsonResponse(text));
    } catch (error) {
      logger.error('AI Description completion failed:', error);
      throw new AIProviderError(
        'google',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
}
