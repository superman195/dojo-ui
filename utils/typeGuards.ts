import { Task } from '@/types/QuestionPageTypes';
import { TaskPayloadNew } from '@/utils/states';

export function isTaskPayloadNew(task: Task | TaskPayloadNew | null): task is TaskPayloadNew {
  return (
    task !== null &&
    'taskData' in task &&
    'responses' in task.taskData &&
    Array.isArray(task.taskData.responses) &&
    task.taskData.responses.length > 0 &&
    'model' in task.taskData.responses[0] &&
    'completion' in task.taskData.responses[0] &&
    'criteria' in task.taskData.responses[0]
  );
}

export function isLegacyTask(task: Task | TaskPayloadNew | null): task is Task {
  return (
    task !== null &&
    'taskData' in task &&
    'criteria' in task.taskData &&
    Array.isArray(task.taskData.criteria) &&
    'responses' in task.taskData &&
    Array.isArray(task.taskData.responses)
  );
}
