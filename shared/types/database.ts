export interface Database {
  users: UserTable
  pd_passwords: PasswordsTable
  pd_session: SessionTable
  tasks: TasksTable,
  journals: JournalsTable
  task_subtasks: SubtasksTable
  routines: RoutinesTable
}
