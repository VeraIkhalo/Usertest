import { useEffect, useMemo, useState } from 'react'
import './App.css'

type TaskStatus = 'todo' | 'in-progress' | 'done'

type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdAt: string
}

const STORAGE_KEY = 'task-manager-tasks'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Task[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (event: React.FormEvent) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      description: description.trim() || undefined,
      status: 'todo',
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [newTask, ...prev])
    setTitle('')
    setDescription('')
  }

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        statusFilter === 'all' ? true : task.status === statusFilter,
      )
      .filter((task) => {
        if (!search.trim()) return true
        const query = search.toLowerCase()
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description ?? '').toLowerCase().includes(query)
        )
      })
  }, [tasks, statusFilter, search])

  const counts = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks],
  )

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Task Manager</h1>
          <p className="app-subtitle">
            Lightweight task tracking with local persistence.
          </p>
        </div>
        <div className="app-counters">
          <span>
            Total: <strong>{counts.total}</strong>
          </span>
          <span>
            Todo: <strong>{counts.todo}</strong>
          </span>
          <span>
            In progress: <strong>{counts.inProgress}</strong>
          </span>
          <span>
            Done: <strong>{counts.done}</strong>
          </span>
        </div>
      </header>

      <main className="app-main">
        <section className="panel">
          <h2>Create a task</h2>
          <form className="task-form" onSubmit={handleAddTask}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="e.g. Review pull requests"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="description">
                Description <span className="muted">(optional)</span>
              </label>
              <textarea
                id="description"
                placeholder="Add more details, links, or notes…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className="primary-btn"
                disabled={!title.trim()}
              >
                Add task
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <div className="tasks-controls">
              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
              >
                <option value="all">All statuses</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <input
                type="search"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <p className="empty-state">
              No tasks yet. Create your first task to get started.
            </p>
          ) : (
            <ul className="task-list">
              {filteredTasks.map((task) => (
                <li key={task.id} className={`task task-${task.status}`}>
                  <div className="task-main">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      <span className={`status-pill status-${task.status}`}>
                        {task.status === 'todo' && 'Todo'}
                        {task.status === 'in-progress' && 'In progress'}
                        {task.status === 'done' && 'Done'}
                      </span>
                    </div>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                    <p className="task-meta">
                      Created{' '}
                      {new Date(task.createdAt).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  <div className="task-actions">
                    <label className="visually-hidden" htmlFor={task.id}>
                      Update status
                    </label>
                    <select
                      id={task.id}
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(
                          task.id,
                          e.target.value as TaskStatus,
                        )
                      }
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button
                      type="button"
                      className="ghost-btn danger"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <span>Data is stored locally in your browser.</span>
      </footer>
    </div>
  )
}

export default App
