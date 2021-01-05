import { h, Component } from 'preact';
import { WavAudio } from 'flipnote.js';
import WaveSurfer from 'wavesurfer.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram';

const saveBlob = (function () {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';
  return function (blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

interface Props {
  buffer: Int16Array
};

interface State {
  isPlaying: boolean;
  volume: number;
  clipRatio: number;
  average: number;
};

export class WaveViewer extends Component<Props,  State> {

  state: State = {
    isPlaying: false,
    volume: 1,
    clipRatio: 0,
    average: 0,
  };

  sourceBuffer: AudioBuffer;
  wavesurfer: WaveSurfer;
  waveEl: HTMLElement = null;
  spectroEl: HTMLElement = null;
  setWaveEl = (dom: HTMLElement) => this.waveEl = dom;
  setSpectroEl = (dom: HTMLElement) => this.spectroEl = dom;

  componentDidMount() {
    const wavesurfer = WaveSurfer.create({
      container: this.waveEl,
      scrollParent: true,
      waveColor: '#ff751e',
      progressColor: '#ff751e',
      cursorColor: 'black',
      minPxPerSec: 100,
      pixelRatio: 1,
      fillParent: false,
      height: 200,
      plugins: [
        SpectrogramPlugin.create({
          container: this.spectroEl,
          labels: true,
          fftSamples: 512
        })
      ]
    });
    wavesurfer.on('play', () => {
      this.setState({ isPlaying: true });
    });
    wavesurfer.on('pause', () => {
      this.setState({ isPlaying: false });
    });
    this.wavesurfer = wavesurfer;
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // if the source buffer has changed
    if (nextProps.buffer instanceof Int16Array && this.props.buffer !== nextProps.buffer) {
      const pcm16 = nextProps.buffer;
      const numSamples = pcm16.length;
      const audioBuffer = new AudioBuffer({length: numSamples, sampleRate: 16364});
      const pcmF32 = new Float32Array(numSamples);

      let numClippedSamples = 0;
      let sum = 0;
      pcm16.forEach((sample, i) => {
        // count number of samples that hit the clipping boundary
        if (sample <= -32768 || sample >= 32767)
          numClippedSamples += 1;
        // convert sample to float 0..1 range
        const floatSample = sample / 32767;
        // sum samples for calculating an average
        sum += floatSample;
        pcmF32[i] = floatSample;
      });
      audioBuffer.copyToChannel(pcmF32, 0, 0);
      this.setState({
        clipRatio: numClippedSamples / numSamples,
        average: sum / numSamples,
      });
      delete this.sourceBuffer;
      this.sourceBuffer = audioBuffer;
      this.wavesurfer.empty();
      this.wavesurfer.loadDecodedBuffer(audioBuffer);
    }
    return true;
  }

  componentWillUnmount() {
    this.wavesurfer.destroy();
  }

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div class="WaveViewer">
        <div class="WaveViewer__wave" ref={ this.setWaveEl }></div>
        <div class="WaveViewer__spectro" ref={ this.setSpectroEl }></div>
        <div class="WaveViewer__controls">
          <div class="ButtonGroup WaveViewer__controlGroup--left">
            <div class="Button" style={{ width: '70px' }} onClick={ this.togglePlay }>{ state.isPlaying ? 'Pause' : 'Play' }</div>
            <div class="Button" onClick={ this.saveWav }>Download .WAV</div>
            <span class="WaveViewer__stat">
              <input
                type="range"
                name=""
                id=""
                min="0"
                max="1"
                step=".01"
                onInput={ this.updateVolume }
              />
            </span>
          </div>
          <div class="WaveViewer__controlGroup--right">
            <span class="WaveViewer__stat">Clipping ratio: { (state.clipRatio * 100).toPrecision(2) }%</span>
            <span class="WaveViewer__stat">Average: { (state.average).toPrecision(3) }%</span>
          </div>
        </div>
      </div>
    );
  }

  updateVolume = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseFloat(target.value);
    console.log(value)
    this.wavesurfer.setVolume(value);
    this.setState({ volume: value });
  }

  togglePlay = () => {
    if (this.wavesurfer.isPlaying())
      this.wavesurfer.pause();
    else
      this.wavesurfer.play();
  }

  saveWav = () => {
    const pcm16 = this.props.buffer;
    const wav = new WavAudio(16364, 1, 16);
    wav.writeFrames(pcm16);
    const blob = wav.getBlob();
    saveBlob(blob, 'out.wav');
  }

}