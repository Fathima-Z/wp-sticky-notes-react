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

  async componentDidMount() {
    const notes = await this.getNotesFromWp(); 
  
    notes.map(single => {
      this.add(single.title.rendered, single.content.rendered);
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
  add(title, content) {
    const { notes } = this.state;
    notes.push({
      id: this.nextId(this),
      title,
      content,
    });
    this.setState({ notes });
  }

  // Update note text
  async update(title, content, i) {
    const notes = [ ...this.state.notes ];
    const newNotes = [
      ...notes.map((note, currentIndex) => {
        if( i === currentIndex ) {
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

    this.setState({notes: newNotes});
    await this.addNoteToWp(title, content);    
  }

  // Remove note
  remove(i) {}

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
      />
    );
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
        </header>
        <div className="notes">{notes.map(this.renderNotes.bind(this))}</div>
      </div>
    );
  }
}
