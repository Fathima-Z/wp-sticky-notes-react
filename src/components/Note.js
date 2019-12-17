import React, { Component } from "react";

const saveText = "SAVE";
const removeToolTipText = "Remove note";

export default class Note extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  // Turn on edit moge
  edit() {
    this.setState({editing: true});
  }

  // Save edits
  save() {
    const { index } = this.props;
    this.props.onChange('Test title', this.newText.value, index);
    this.setState({editing: false});
  }

  // Remove note
  remove() {
    const { index } = this.props;
    this.props.onRemove(index);
  }

  // Render note body
  renderNoteBody(content, title, save) {
    const { editing } = this.state;
    return (
      <div draggable="true" onDragStart={(e) => this.onDragStart(e)} onDoubleClick={() => this.edit()} className="note" style={this.style}>
        <article>
          <header className="note__header">
            <div className="wrapper-tooltip">
               <span title={removeToolTipText} onClick={() => this.remove()} className="close hairline"></span>
               <strong className="">{title}</strong>
            </div>
          </header>
          {
              editing ?
            <div className="note__content">{content ? content : ''}</div>
              :
            <div className="note__content" dangerouslySetInnerHTML={{ __html: content ? content : '' }} />              
          }
          <footer className="note__footer">
            <div className="note__fold"></div>
            {save ? <div className="note__save" onClick={() => this.save()}>{saveText}</div> : ""}
          </footer>
        </article>
      </div>
    );
  }

  // Render note preview
  renderDisplay() {
    const { title, content } = this.props;
    return this.renderNoteBody(content, title);
  }

  // Render note edit mode
  renderForm() {
    const { title, content } = this.props;
    const element = (
      <div>
        <textarea ref={ref => this.newText = ref} defaultValue={content ? content : ''} className="note__textarea"></textarea>
      </div>
    );

    return this.renderNoteBody(element, title, true);
  }

  render() {
    const { editing } = this.state;
    return (editing ? this.renderForm() : this.renderDisplay());
  }
}
