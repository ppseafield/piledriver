import { ExpressionWrapper, sql } from 'kysely'
import type { ReorderTaskResult, ArchiveTaskResult } from '@@/shared/types/tasks'
import type { ReorderSubtaskResult, ArchiveSubtaskResult } from '@@/shared/types/subtasks'
import type { ReorderRoutineSubtaskResult, ArchiveRoutineSubtaskResult } from '@@/shared/types/routine_subtasks'

// TODO: do something with UUIDs please. even a type alias!
export const reorder_task = (pd_user_id: string, move_task_id: string, move_new_id: string) => {
  return new ExpressionWrapper<'reorder_task', 'toString', ReorderTaskResult>(
    sql<ReorderTaskResult[]>`public.reorder_task(${pd_user_id}, ${move_task_id}, ${move_new_id})`.toOperationNode(),
  ).as('rt')
}

export const archive_task = (pd_user_id: string, archive_task_id: string) => {
  return new ExpressionWrapper<'archive_task', 'toString', ArchiveTaskResult>(
    sql<ArchiveTaskResult[]>`public.archive_task(${pd_user_id}, ${archive_task_id})`.toOperationNode()
  ).as('ast')
}

export const reorder_subtask = (pd_user_id: string, move_subtask_id: string, move_new_order: number) => {
  return new ExpressionWrapper<'reorder_subtask', 'toString', ReorderSubtaskResult>(
    sql<ReorderSubtaskResult[]>`public.reorder_subtask(${pd_user_id}, ${move_subtask_id}, ${move_new_order})`.toOperationNode()
  ).as('rst')
}

export const archive_subtask = (pd_user_id: string, archive_subtask_id: string) => {
  return new ExpressionWrapper<'archive_subtask', 'toString', ArchiveSubtaskResult>(
    sql<ArchiveSubtaskResult[]>`public.archive_subtask(${pd_user_id}, ${archive_subtask_id})`.toOperationNode()
  ).as('ast')
}

export const reorder_routine_subtask = (pd_user_id: string, move_routine_subtask_id: string, move_new_order: number) => {
  return new ExpressionWrapper<'reorder_routine_subtask', 'toString', ReorderRoutineSubtaskResult>(
    sql<ReorderRoutineSubtaskResult[]>`public.reorder_routine_subtask(${pd_user_id}, ${move_routine_subtask_id}, ${move_new_order})`.toOperationNode()
  ).as('rrst')
}

export const archive_routine_subtask = (pd_user_id: string, archive_routine_subtask_id: string) => {
  return new ExpressionWrapper<'archive_routine_subtask', 'toString', ArchiveRoutineSubtaskResult>(
    sql<ArchiveRoutineSubtaskResult[]>`public.archive_routine_subtask(${pd_user_id}, ${archive_routine_subtask_id})`.toOperationNode()
  ).as('ast')
}

// TODO: then replace all of the usages in `/server/api` with those wrappers.
