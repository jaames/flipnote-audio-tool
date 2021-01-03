import { h, Component } from 'preact';
import { Flipnote, GifImage } from 'flipnote.js';

interface Props {
  note: Flipnote;
};

interface State {
  isNoteLoaded: boolean;
  gifUrl: string;
  author: string;
  filename: string;
  frameCount: number;
};

export class NotePreview extends Component<Props, State> {

  shouldComponentUpdate(nextProps: Props) {
    const note = nextProps.note;
    if (note && note !== this.props.note) {
      const gif = GifImage.fromFlipnoteFrame(note, note.thumbFrameIndex);
      const meta = note.meta;
      const url = gif.getUrl();
      this.setState({
        isNoteLoaded: true,
        gifUrl: url,
        author: meta.current.username,
        filename: meta.current.filename,
        frameCount: meta.frameCount
      });
    }
    return true;
  }

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div class="NotePreview">
        <div 
          class="NotePreview__thumb"
          style={{ backgroundImage: `url(${ state.gifUrl })` }}
        />
        <div class="NotePreview__details">
          <h3 class="NotePreview__title">Flipnote by { state.author }</h3>
          <div>{ state.filename }.kwz</div>
          <div>{ state.frameCount} frames</div>
        </div>
      </div>
    );
  }
}