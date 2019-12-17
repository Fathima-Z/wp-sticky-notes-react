import React, { Component } from "react";

export default class Note extends Component {

  // Render note
  renderNoteBody(content, title, save) {
    return (
      <div className="note" style={this.style}>
        <article>
          <header className="note__header">
            <div className="wrapper-tooltip">
               <span className="close hairline"></span>
               <strong className="">{title}</strong>
            </div>
          </header>
            <div className="note__content" dangerouslySetInnerHTML={{ __html: content }} />              
          <footer className="note__footer">
            <div className="note__fold"></div>
          </footer>
        </article>
      </div>
    );
  }

  render() {
    const { title, content } = this.props;
    return this.renderNoteBody(content, title);
  }
}
