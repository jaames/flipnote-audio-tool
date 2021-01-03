import { Flipnote, FlipnoteFormat, FlipnoteAudioTrack } from 'flipnote.js';

export function clamp(n: number, l: number, h: number) {
  if (n < l)
    return l;
  if (n > h)
    return h;
  return n;
}

export enum SampleSize {
  FourBit,
  TwoBit,
  Variable
}

export class AudioRenderer {

  public audioBuffer: AudioBuffer;

  public isNoteLoaded = false;
  public note?: Flipnote;
  public rawAudioData?: Uint8Array;

  // initial decoder state values
  public initialPredictor = 0;
  public initialStepIndex = 40;
  public initialSample = 0;
  public initialStep = 0;
  public initialDiff = 0;

  // clamp and scale values
  public stepIndexClampMin = 0;
  public stepIndexClampMax = 79;
  public predictorClampMin = -2048;
  public predictorClampMax = 2047;
  public predictorScale = 16;

  // misc settings
  public sampleSize: SampleSize = SampleSize.Variable;
  public variableSwitchThreshold = 18;

  // adpcm tables
  public indexTable2Bit = [
    -1, 2, -1, 2
  ];
  public indexTable4Bit = [
    -1, -1, -1, -1, 2, 4, 6, 8,
    -1, -1, -1, -1, 2, 4, 6, 8
  ];
  public stepTable = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767, 0
  ];

  public loadFlipnote(note: Flipnote) {
    if (note.format !== FlipnoteFormat.KWZ)
      throw new Error('This tool is only for KWZs');
    this.note = note;
    this.isNoteLoaded = true;
    // Get the raw bytes of the BGM audio track
    this.rawAudioData = note.getAudioTrackRaw(FlipnoteAudioTrack.BGM);
  }

  public renderPcm() {
    if (!this.note || !this.rawAudioData)
      return new Int16Array();

    const input = this.rawAudioData;
    // initial decoder state
    let predictor = this.initialPredictor;
    let stepIndex = this.initialStepIndex;
    let sample = this.initialSample;
    let step = this.initialStep;
    let diff = this.initialDiff;
    // clamps and scaling
    const stepIndexClampMin = this.stepIndexClampMin;
    const stepIndexClampMax = this.stepIndexClampMax;
    const predictorClampMin = this.predictorClampMin;
    const predictorClampMax = this.predictorClampMax;
    const predictorScale = this.predictorScale;
    // bitdepth settings
    const bitDepth = this.sampleSize;
    const bitDepthSwitchThreshold = this.variableSwitchThreshold;
    // tables
    const indexTable2Bit = new Int8Array(this.indexTable2Bit);
    const indexTable4Bit = new Int8Array(this.indexTable4Bit);
    const stepTable = new Int16Array(this.stepTable);
    // output
    const output = new Int16Array(16364 * 60);
    let outputPtr = 0;
    // loop through each byte in the raw adpcm data
    for (let inputPtr = 0; inputPtr < input.length; inputPtr++) {
      let currByte = input[inputPtr];
      let currBit = 0;
      while (currBit < 8) {
        // 2 bit sample
        if (bitDepth === SampleSize.TwoBit || (bitDepth === SampleSize.Variable && (stepIndex < bitDepthSwitchThreshold || currBit > 4))) {
          sample = currByte & 0x3;
          step = stepTable[stepIndex];
          diff = step >> 3;
          if (sample & 1)
            diff += step;
          if (sample & 2)
            diff = -diff;
          predictor += diff;
          stepIndex += indexTable2Bit[sample];
          currByte >>= 2;
          currBit += 2;
        }
        // 4 bit sample
        else {
          sample = currByte & 0xf;
          step = stepTable[stepIndex];
          diff = step >> 3;
          if (sample & 1) 
            diff += step >> 2;
          if (sample & 2) 
            diff += step >> 1;
          if (sample & 4)
            diff += step;
          if (sample & 8)
            diff = -diff;
          predictor += diff;
          stepIndex += indexTable4Bit[sample];
          currByte >>= 4;
          currBit += 4;
        }
        stepIndex = clamp(stepIndex, stepIndexClampMin, stepIndexClampMax);
        predictor = clamp(predictor, predictorClampMin, predictorClampMax);
        output[outputPtr] = predictor * predictorScale;
        outputPtr += 1;
      }
    }
    return output.slice(0, outputPtr);
  }

}