import { LitElement, html, css } from 'lit-element';
import firebase from "firebase/app";
import "firebase/firestore";
import { TodoList } from './TodoList';

const firebaseConfig = {
  apiKey: "AIzaSyCyfVP7ZQ4DtxEAMUVGoeHq6hWs_tBe0Es",
  authDomain: "todo-app-7a2a7.firebaseapp.com",
  databaseURL: "https://todo-app-7a2a7.firebaseio.com",
  projectId: "todo-app-7a2a7",
  storageBucket: "todo-app-7a2a7.appspot.com",
  messagingSenderId: "1048136573768",
  appId: "1:1048136573768:web:aa7df2091751cb0f19497d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export class TodoApp extends LitElement {
  static get properties() {
    return {
      todos: { type: Array },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
      }

      header {
        width: 100%;
        background: #fff;
        border-bottom: 1px solid #ccc;
      }

      header ul {
        display: flex;
        justify-content: space-around;
        min-width: 400px;
        margin: 0 auto;
        padding: 0;
      }

      header ul li {
        display: flex;
      }

      header ul li a {
        color: #5a5c5e;
        text-decoration: none;
        font-size: 18px;
        line-height: 36px;
      }

      header ul li a:hover,
      header ul li a.active {
        color: blue;
      }

      main {
        flex-grow: 1;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }
    `;
  }

  constructor() {
    super();

    this.todos = [];

    db.collection('todos').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.todos = [
            ...this.todos,
            doc.data()
          ];
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  render() {
    return html`
      <h1>Todo App</h1>

      <input type="text" id="addTodoInput" placeholder="Name" />
      <button @click="${this._addTodo}">Add</button>

      <todo-list
        .todos=${this.todos}
        @change-todo-finished="${this._changeTodoFinished}"
        @remove-todo="${this._removeTodo}"></todo-list>

      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer" href="https://github.com/open-wc">open-wc</a>.
      </p>
    `;
  }

  _addTodo() {
    const input = this.shadowRoot.getElementById('addTodoInput');
    const text = input.value;
    input.value = '';

    const docref = db.collection('todos').doc(text);

    docref.set({
      text,
      finished: false,
    });

    this.todos = [
      ...this.todos,
      { text, finished: false }
    ];
  }

  _changeTodoFinished(e) {
    const { text } = e.detail.changeTodo;
    const { finished } = e.detail;

    const docref = db.collection('todos').doc(text);

    docref.update({ finished });

    this.todos = this.todos.map(todo => {
      if(todo !== text) {
        return todo
      }

      return { ...text, finished }
    });
  }

  _removeTodo(e) {
    db.collection('todos').doc(e.detail.text).delete();
    this.todos = this.todos.filter(todo => todo !== e.detail);
  }
}
