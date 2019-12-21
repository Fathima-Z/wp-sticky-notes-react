import React, { Component } from "react";

const saveText = "SAVE";
const removeToolTipText = "Remove note";

export default class Note extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editingContent: false,
      editingTitle: false,
    };
  }

  // Turn on edit moge
  editContent() {
    this.setState({editingContent: true});
  }

  // Turn on edit moge
  editTitle() {
    this.setState({editingTitle: true});
  }

  // Save edits
  save() {
    const { index, content, title } = this.props;
    const titleValue = this.newTitleRef ? this.newTitleRef.value : title;
    const contentValue = this.newContentRef ? this.newContentRef.value : content;
    this.props.onChange(titleValue, contentValue, index);
    this.setState({editingContent: false, editingTitle: false});
  }

  // Remove note
  remove() {
    const { id } = this.props;
    this.props.onRemove(id);
  }

  // Render note body
  renderNoteBody(content, title, id, save) {
    const { editingContent } = this.state;
    const { editingTitle } = this.state;
    return (
      <div className="note fadein">
        <article>
          <header className="note__header">
            <div className="wrapper-tooltip">
               <span title={removeToolTipText} onClick={() => this.remove()} className="close hairline"></span>
               {
                  editingTitle ?
                <strong className="note__title">{title ? title : ''}</strong>
                  :
                <strong onClick={() => this.editTitle()} className="note__title" dangerouslySetInnerHTML={{ __html: title ? title : '' }} />              
              }
            </div>
          </header>
          {
              editingContent ?
            <div className="note__content">{content ? content : ''}</div>
              :
            <div onClick={() => this.editContent()} className="note__content" dangerouslySetInnerHTML={{ __html: content ? content : '' }} />              
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
    const { id, title, content } = this.props;
    return this.renderNoteBody(content, title, id);
  }

  // Render note edit mode
  renderForm() {
    const { title, content, id } = this.props;
    const { editingContent, editingTitle } = this.state;

    const contentElement = editingContent ?
     (
      <div>
        <textarea ref={ref => this.newContentRef = ref} defaultValue={content ? content : ''} className="note__textarea"></textarea>
      </div>
    ) : content

    const titleElement = editingTitle ? (
      <div>
        <input type="text" ref={ref => this.newTitleRef = ref} defaultValue={title ? title : ''} className="title__editing" />
      </div>
    ) : title

    return this.renderNoteBody(contentElement, titleElement, id, true);
  }

  render() {
    const { editingContent, editingTitle } = this.state;
    return ((editingContent || editingTitle) ? this.renderForm() : this.renderDisplay());
  }
}
