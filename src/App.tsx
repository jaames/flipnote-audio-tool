import { h, Component } from 'preact';
import { Flipnote, parseSource } from 'flipnote.js';
import { AudioRenderer, SampleSize } from './AudioRenderer';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { NotePreview } from './components/NotePreview';
import { WaveViewer } from './components/WaveViewer';
import { InputGroup } from './components/InputGroup';
import { Input } from './components/Input';
import { EnumInput } from './components/EnumInput';

import sampleUrl from '../samples/ppm-convert-1.kwz';

interface Props {};

interface State {
  note: Flipnote;
  pcmBuffer?: Int16Array;
  // initial adpcm state
  initialPredictor: number;
  initialStepIndex: number;
  initialSample: number;
  initialStep: number;
  initialDiff: number;
  // adpcm clamp + scale
  stepIndexClampMin: number;
  stepIndexClampMax: number;
  predictorClampMin: number;
  predictorClampMax: number;
  predictorScale: number;
  // sampling
  sampleSize: SampleSize;
  variableSwitchThreshold: number;
  indexTable2Bit: number[];
  indexTable4Bit: number[];
  stepTable: number[];
};

export class App extends Component<Props, State> {
  audioRenderer = new AudioRenderer();
  state: State = {
    note: null,
    pcmBuffer: null,
    initialPredictor: this.audioRenderer.initialPredictor,
    initialStepIndex: this.audioRenderer.initialStepIndex,
    initialSample: this.audioRenderer.initialSample,
    initialStep: this.audioRenderer.initialStep,
    initialDiff: this.audioRenderer.initialDiff,
    stepIndexClampMin: this.audioRenderer.stepIndexClampMin,
    stepIndexClampMax: this.audioRenderer.stepIndexClampMax,
    predictorClampMin: this.audioRenderer.predictorClampMin,
    predictorClampMax: this.audioRenderer.predictorClampMax,
    predictorScale: this.audioRenderer.predictorScale,
    sampleSize: this.audioRenderer.sampleSize,
    variableSwitchThreshold: this.audioRenderer.variableSwitchThreshold,
    indexTable2Bit: this.audioRenderer.indexTable2Bit,
    indexTable4Bit: this.audioRenderer.indexTable4Bit,
    stepTable: this.audioRenderer.stepTable
  };

  async loadFlipnote(source: any) {
    const note = await parseSource(source);
    this.audioRenderer.loadFlipnote(note);
    await this.setState({ note });
    this.updateAudio();
  }

  componentDidMount() {
    this.loadFlipnote(sampleUrl);
  }

  handleFileUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files.length) {
      const file = target.files[0];
      this.loadFlipnote(file);
    }
  }

  // call this whenever an audioRenderer setting has been updated
  async updateAudio() {
    const pcmBuffer = this.audioRenderer.renderPcm();
    this.setState({ pcmBuffer });
  }

  updateInitialPredictor = (value: number) => {
    this.setState({ initialPredictor: value });
    if (!isNaN(value)) {
      this.audioRenderer.initialPredictor = value;
      this.updateAudio();
    }
  }

  updateInitialStepIndex = (value: number) => {
    this.setState({ initialStepIndex: value });
    if (!isNaN(value)) {
      this.audioRenderer.initialStepIndex = value;
      this.updateAudio();
    }
  }

  updateInitialSample = (value: number) => {
    this.setState({ initialSample: value });
    if (!isNaN(value)) {
      this.audioRenderer.initialSample = value;
      this.updateAudio();
    }
  }

  updateInitialStep = (value: number) => {
    this.setState({ initialStep: value });
    if (!isNaN(value)) {
      this.audioRenderer.initialStep = value;
      this.updateAudio();
    }
  }

  updateInitialDiff = (value: number) => {
    this.setState({ initialDiff: value });
    if (!isNaN(value)) {
      this.audioRenderer.initialDiff = value;
      this.updateAudio();
    }
  }

  updateStepIndexClampMin = (value: number) => {
    this.setState({ stepIndexClampMin: value });
    if (!isNaN(value)) {
      this.audioRenderer.stepIndexClampMin = value;
      this.updateAudio();
    }
  }

  updateStepIndexClampMax = (value: number) => {
    this.setState({ stepIndexClampMax: value });
    if (!isNaN(value)) {
      this.audioRenderer.stepIndexClampMax = value;
      this.updateAudio();
    }
  }

  updatePredictorClampMin = (value: number) => {
    this.setState({predictorClampMin: value });
    if (!isNaN(value)) {
      this.audioRenderer.predictorClampMin = value;
      this.updateAudio();
    }
  }

  updatePredictorClampMax = (value: number) => {
    this.setState({predictorClampMax: value });
    if (!isNaN(value)) {
      this.audioRenderer.predictorClampMax = value;
      this.updateAudio();
    }
  }

  updatePredictorScale = (value: number) => {
    this.setState({predictorScale: value });
    if (!isNaN(value)) {
      this.audioRenderer.predictorScale = value;
      this.updateAudio();
    }
  }

  updateSampleSize = (value: number) => {
    this.setState({sampleSize: value });
    if (!isNaN(value)) {
      this.audioRenderer.sampleSize = value;
      this.updateAudio();
    }
  }

  updateVariableSwitchThreshold = (value: number) => {
    this.setState({variableSwitchThreshold: value });
    if (!isNaN(value)) {
      this.audioRenderer.variableSwitchThreshold = value;
      this.updateAudio();
    }
  }

  updateIndexTable2Bit = (value: number[]) => {
    if (Array.isArray(value)) {
      this.setState({indexTable2Bit: value });
      this.audioRenderer.indexTable2Bit = value;
      this.updateAudio();
    }
  }

  updateIndexTable4Bit = (value: number[]) => {
    if (Array.isArray(value)) {
      this.setState({indexTable4Bit: value });
      this.audioRenderer.indexTable4Bit = value;
      this.updateAudio();
    }
  }

  updateStepTable = (value: number[]) => {
    if (Array.isArray(value)) {
      this.setState({stepTable: value });
      this.audioRenderer.stepTable = value;
      this.updateAudio();
    }
  }

  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div class="App">
        <Header/>
        <div class="Row">
          <div class="Column">
            <div class="UploadPanel">
              <input type="file" accept=".kwz" onChange={ this.handleFileUpload }/>
            </div>
          </div>
          <div class="Column">
            <NotePreview note={ state.note }/>
          </div>
        </div>
        <WaveViewer buffer={ state.pcmBuffer }></WaveViewer>
        <InputGroup title="Initial ADPCM State">
          <Input
            title="Step Index"
            id="initialStepIndex"
            type="int"
            value={ state.initialStepIndex }
            onInput={ this.updateInitialStepIndex }
          />
          <Input
            title="Predictor"
            id="initialPredictor"
            type="int"
            value={ state.initialPredictor }
            onInput={ this.updateInitialPredictor }
          />
          <Input
            title="Sample"
            id="initialSample"
            type="int"
            value={ state.initialSample }
            onInput={ this.updateInitialSample }
          />
          <Input
            title="Step"
            id="initialStep"
            type="int"
            value={ state.initialStep }
            onInput={ this.updateInitialStep }
          />
          <Input
            title="Diff"
            id="initialDiff"
            type="int"
            value={ state.initialDiff }
            onInput={ this.updateInitialDiff }
          />
        </InputGroup>
        <InputGroup title="ADPCM Clamping &amp; Scale">
          <Input
            title="Step Index Clamp Min."
            id="stepIndexClampMin"
            type="int"
            value={ state.stepIndexClampMin }
            onInput={ this.updateStepIndexClampMin }
          />
          <Input
            title="Step Index Clamp Max."
            id="stepIndexClampMax"
            type="int"
            value={ state.stepIndexClampMax }
            onInput={ this.updateStepIndexClampMax }
          />
          <Input
            title="Predictor Clamp Min."
            id="predictorClampMin"
            type="int"
            value={ state.predictorClampMin }
            onInput={ this.updatePredictorClampMin }
          />
          <Input
            title="Predictor Clamp Max."
            id="predictorClampMax"
            type="int"
            value={ state.predictorClampMax }
            onInput={ this.updatePredictorClampMax }
          />
          <Input
            title="Predictor Scale"
            id="predictorScale"
            type="int"
            value={ state.predictorScale }
            onInput={ this.updatePredictorScale }
          />
        </InputGroup>
        <InputGroup title="ADPCM Sampling">
          <EnumInput
            title="Sample Size"
            id="sampleSize"
            options={ SampleSize }
            value={ state.sampleSize }
            onInput={ this.updateSampleSize }
          />
          <Input
            title="Variable Threshold"
            id="switchThreshold"
            type="int"
            disabled={ state.sampleSize !== SampleSize.Variable }
            value={ state.variableSwitchThreshold }
            onInput={ this.updateVariableSwitchThreshold }
          />
          <div class="BigInputGroup">
            <Input
              title="2 Bit Index Table"
              id="2BitIndexTable"
              type="array"
              value={ state.indexTable2Bit }
              onInput={ this.updateIndexTable2Bit }
            />
            <Input
              title="4 Bit Index Table"
              id="4BitIndexTable"
              type="array"
              value={ state.indexTable4Bit }
              onInput={ this.updateIndexTable4Bit }
            />
            <Input
              title="Step Table"
              id="stepTable"
              type="array"
              textarea={ true }
              value={ state.stepTable }
              onInput={ this.updateStepTable }
            />
          </div>
        </InputGroup>
        <Footer/>
      </div>
    );
  }
}