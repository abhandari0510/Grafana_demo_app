import React, { useEffect, useMemo, useState } from 'react';
import TaskCard from './components/TaskCard';
import { createTask, deleteTask, fetchTasks, toggleTask, triggerFailureDemo } from './lib/apiClient';
import { createLogger } from './lib/logger';

const log = createLogger('App');

function normalizeError(error) {
  return {
    message: error?.data?.message || error?.message || 'Unexpected error',
    code: error?.code || 'UNKNOWN_ERROR',
    requestId: error?.requestId || 'na'
  };
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [titleInput, setTitleInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [banner, setBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  const completedCount = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  async function loadTasks() {
    setIsLoading(true);
    setErrorBanner('');
    try {
      const response = await fetchTasks();
      setTasks(response.data || []);
      log.info('tasks_loaded', {
        requestId: response.requestId,
        count: response.data?.length || 0
      });
    } catch (error) {
      const normalized = normalizeError(error);
      setErrorBanner(`Could not load tasks: ${normalized.message}`);
      log.error('tasks_load_failed', normalized);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(event) {
    event.preventDefault();

    const cleanTitle = titleInput.trim();
    if (!cleanTitle) {
      return;
    }

    setIsSaving(true);
    setBanner('');
    setErrorBanner('');

    try {
      const response = await createTask(cleanTitle);
      setTasks((existing) => [response.data, ...existing]);
      setTitleInput('');
      setBanner('Task created successfully.');
      log.info('task_created', {
        requestId: response.requestId,
        taskId: response.data?.id
      });
    } catch (error) {
      const normalized = normalizeError(error);
      setErrorBanner(`Create failed: ${normalized.message}`);
      log.error('task_create_failed', normalized);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleTask(taskId) {
    setErrorBanner('');

    try {
      const response = await toggleTask(taskId);
      setTasks((existing) =>
        existing.map((task) => (task.id === taskId ? response.data : task))
      );
      log.info('task_toggled', {
        requestId: response.requestId,
        taskId
      });
    } catch (error) {
      const normalized = normalizeError(error);
      setErrorBanner(`Toggle failed: ${normalized.message}`);
      log.error('task_toggle_failed', {
        ...normalized,
        taskId
      });
    }
  }

  async function handleDeleteTask(taskId) {
    setErrorBanner('');

    try {
      const response = await deleteTask(taskId);
      setTasks((existing) => existing.filter((task) => task.id !== taskId));
      log.info('task_deleted', {
        requestId: response.requestId,
        taskId
      });
    } catch (error) {
      const normalized = normalizeError(error);
      setErrorBanner(`Delete failed: ${normalized.message}`);
      log.error('task_delete_failed', {
        ...normalized,
        taskId
      });
    }
  }

  async function handleIntentionalFailure() {
    setBanner('');
    setErrorBanner('');

    try {
      await triggerFailureDemo();
      setErrorBanner('Unexpected success from failure endpoint.');
      log.warn('intentional_failure_unexpected_success');
    } catch (error) {
      const normalized = normalizeError(error);
      setBanner(`Intentional failure triggered successfully (${normalized.code}).`);
      log.info('intentional_failure_triggered', normalized);
    }
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb--one" />
      <div className="bg-orb bg-orb--two" />
      <main className="container">
        <header className="hero">
          <p className="hero__tag">Production Demo Stack</p>
          <h1>Astra Tasks Console</h1>
          <p>
            A three-tier application powered by React, Spring Boot, and MySQL. Designed for local runs and AWS demos.
          </p>
          <div className="hero__stats">
            <div>
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>
            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
            <div>
              <span>Open</span>
              <strong>{tasks.length - completedCount}</strong>
            </div>
          </div>
        </header>

        <section className="panel">
          <form className="task-form" onSubmit={handleCreateTask}>
            <label htmlFor="task-title">Create a task</label>
            <div className="task-form__row">
              <input
                id="task-title"
                type="text"
                maxLength={255}
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                placeholder="Enter a work item..."
                disabled={isSaving}
              />
              <button type="submit" className="btn btn--primary" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Add Task'}
              </button>
            </div>
          </form>

          <div className="actions-row">
            <button type="button" className="btn btn--outline" onClick={loadTasks} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button type="button" className="btn btn--accent" onClick={handleIntentionalFailure}>
              Trigger Intentional Failure
            </button>
          </div>

          {banner ? <p className="banner banner--success">{banner}</p> : null}
          {errorBanner ? <p className="banner banner--error">{errorBanner}</p> : null}

          {isLoading ? (
            <p className="empty-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="empty-state">No tasks yet. Add your first one.</p>
          ) : (
            <section className="task-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  disabled={isSaving}
                />
              ))}
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
