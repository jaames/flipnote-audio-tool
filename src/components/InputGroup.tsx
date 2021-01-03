import { h, FunctionComponent } from 'preact';

interface Props {
  title: string;
};

export const InputGroup: FunctionComponent<Props> = ({ title, children }) => (
  <div class="InputGroup">
    <div class="InputGroup__head">
      <h3 class="InputGroup__title">{ title }</h3>
    </div>
    <div class="InputGroup__body">{ children }</div>
  </div>
);