import React, { Component } from "react";
import Note from "./Note";
import { domain, API, endpoint } from "../config/app.json";
import { AUTH_TOKEN } from "../helper";

const WP_SITE_URL = domain.env.siteUrl + API.WP + API.V2 + endpoint.stickyNotes;
const newNoteText = "Take a note";
const newNoteButtonText = "ADD NEW";

export default class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }

  componentDidMount() {
    this.loadNotes();
  }

  async loadNotes() {
    const notes = await this.getNotesFromWp();

    notes.map(single => {
      this.add(single.title.rendered, single.content.rendered, single.id);
      return null;
    });
  }

  // Get notes from WordPress
  async getNotesFromWp() {
    const res = await fetch(`${WP_SITE_URL}?per_page=100`);
    const data = res.json();
    return data;
  }

  // Save note to WordPress
  async addNoteToWp(title, content) {
    const res = await fetch(WP_SITE_URL, {
      method: "POST",
      body: JSON.stringify({
        title,
        content,
        status: "publish",
        post: 123,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem(AUTH_TOKEN)).token
          }`,
      },
    })

    return res.json()
  }

  // Get next ID
  nextId() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  }

  // Add note to React State
  add(title, content, id) {
    const { notes } = this.state;
    notes.push({
      id,
      title,
      content,
    });
    this.setState({ notes });
  }

  // Update note text
  async update(title, content, i) {
    const notes = [...this.state.notes];
    const newNotes = [
      ...notes.map((note, currentIndex) => {
        if (i === currentIndex) {
          return {
            ...note,
            title,
            content,
          }
        } else {
          return note
        }
      })
    ];

    this.setState({ notes: newNotes });
    await this.addNoteToWp(title, content);
  }

  // Remove note
  async remove(id) {
    await fetch(`${WP_SITE_URL}${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem(AUTH_TOKEN)).token
          }`,
      },
    }).then(res => {
      if (res.status === 200) {
        this.setState({
          notes: [
            ...this.state.notes.filter( note => note.id !== id )
          ]
        })
      }
    })
  }

  // Render Notes
  renderNotes(note, i) {
    return (
      <Note
        key={note.id}
        index={i}
        onChange={this.update.bind(this)}
        onRemove={this.remove.bind(this)}
        title={note.title}
        content={note.content}
        id={note.id}
      />
    );
  }

  logout() {
    localStorage.removeItem(AUTH_TOKEN);
    this.props.history.push('/');
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="board">
        <header className="main-header">
          <div
            className="main-header__text fadein"
            onClick={this.add.bind(this, newNoteText, false)}
          >
            {newNoteButtonText}
          </div>
          <button onClick={this.logout.bind(this)} className="btn btn-danger logout">Log out</button>
        </header>
        <div className="notes">{notes.map(this.renderNotes.bind(this))}</div>
      </div>
    );
  }
}
