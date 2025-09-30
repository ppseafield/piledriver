import { ExpressionWrapper, sql } from 'kysely'
import type { ReorderTaskResult } from '@@/shared/types/tasks'
import type { ReorderSubtaskResult } from '@@/shared/types/subtasks'

// TODO: do something with UUIDs please. even a type alias!
export const reorder_task = (pd_user_id: string, move_task_id: string, move_new_id: string) => {
  return new ExpressionWrapper<'reorder_task', 'toString', ReorderTaskResult>(
    sql<ReorderTaskResult[]>`public.reorder_task(${pd_user_id}, ${move_task_id}, ${move_new_id})`.toOperationNode(),
  ).as('rt')
}

export const reorder_subtask = (pd_user_id: string, move_subtask_id: string, move_new_order: number) => {
  return new ExpressionWrapper<'reorder_subtask', 'toString', ReorderSubtaskResult>(
    sql<ReorderSubtaskResult[]>`public.reorder_subtask(${pd_user_id}, ${move_subtask_id}, ${move_new_order})`.toOperationNode()
  ).as('rst')
}

// TODO: wrap all of the table value functions like this
// TODO: then replace all of the usages in `/server/api` with those wrappers.
