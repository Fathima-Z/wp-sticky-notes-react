import React, { Component } from "react";
import Note from "./Note";
import { domain, API, endpoint } from "../config/app.json";

const WP_SITE_URL = domain.env.siteUrl + API.WP + API.V2 + endpoint.stickyNotes;

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

  // Get next ID
  nextId() {
    this.uniqueId = this.uniqueId || 0;
    return this.uniqueId++;
  }

  add(title, content) {
    const { notes } = this.state;
    notes.push({
      id: this.nextId(this),
      title,
      content,
    });
    this.setState({ notes });
  }

  // Render Notes
  renderNotes(note, i) {
    return (
      <Note
        key={note.id}
        index={i}
        title={note.title}
        content={note.content}
      />
    );
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="board">
        <div className="notes">{notes.map(this.renderNotes.bind(this))}</div>
      </div>
    );
  }
}
