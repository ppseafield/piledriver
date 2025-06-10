export interface Database {
  users: UserTable
  pd_passwords: PasswordsTable
  pd_session: SessionTable
  tasks: TasksTable
}
