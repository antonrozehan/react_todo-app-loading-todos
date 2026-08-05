/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

type FilterType = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadTodos = async () => {
      try {
        const loadedTodos = await getTodos();

        if (isMounted) {
          setTodos(loadedTodos);
          setErrorMessage('');
        }
      } catch {
        if (isMounted) {
          setErrorMessage('Unable to load todos');
        }
      }
    };

    loadTodos();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${
              todos.length > 0 && todos.every(todo => todo.completed) ? 'active' : ''
            }`}
            data-cy="ToggleAllButton"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
            />
          </form>
        </header>

        {visibleTodos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    readOnly
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button type="button" className="todo__remove" data-cy="TodoDelete">
                  ×
                </button>

                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} item{activeTodosCount === 1 ? '' : 's'} left
            </span>

            <nav className="filter" data-cy="Filter">
              {['all', 'active', 'completed'].map(filterType => (
                <a
                  key={filterType}
                  href={filterType === 'all' ? '#/' : `#/${filterType}`}
                  className={`filter__link ${filter === filterType ? 'selected' : ''}`}
                  data-cy={
                    filterType === 'all'
                      ? 'FilterLinkAll'
                      : filterType === 'active'
                        ? 'FilterLinkActive'
                        : 'FilterLinkCompleted'
                  }
                  onClick={event => {
                    event.preventDefault();
                    setFilter(filterType as FilterType);
                  }}
                >
                  {filterType === 'all'
                    ? 'All'
                    : filterType === 'active'
                      ? 'Active'
                      : 'Completed'}
                </a>
              ))}
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed)}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
