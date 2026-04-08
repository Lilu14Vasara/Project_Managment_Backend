export const UserRole = {
    ADMIN:"admin",
    PROJECT_ADMIN:"project_admin",
    MEMEBER:"member"
}

export const AvailableRole=Object.values(UserRole)//array above object values

export const TaskStatus={
    TODO:'todo',
    IN_PROGRESS:'in_progress',
    DONE:'done' 
}
export const AvailableTaskStatus=Object.values(TaskStatus)  