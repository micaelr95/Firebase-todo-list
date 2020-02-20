import { html } from 'lit-html';
import { LitElement } from 'lit-element';

export class TodoList extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
    }
  }

  render() {
    if(!this.todos) {
      return html``;
    }

    return html`
      <ul>
        ${this.todos.map(todo => html`
          <li>
            <input type="checkbox"
              .checked="${todo.finished}"
              @change=${e => this._changeTodoFinished(e, todo)} />
              ${todo.text}
              <button @click=${() => this._removeTodo(todo)}>X</button>
          </li>
        `,
        )}
      </ul>
    `;
  }

  _changeTodoFinished(e, changeTodo) {
    const eventDetails = { changeTodo, finished: e.target.checked };

    this.dispatchEvent(new CustomEvent('change-todo-finished', { detail: eventDetails }));
  }

  _removeTodo(item) {
    this.dispatchEvent(new CustomEvent('remove-todo', { detail: item }));
  }
}

customElements.define('todo-list', TodoList);
