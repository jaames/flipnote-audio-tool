import { h, FunctionComponent } from 'preact';

interface Props {
  title: string;
  id: string;
  value: any;
  type: 'int' | 'float' | 'array';
  onInput: (value: any) => void;
  disabled?: boolean;
};

export const Input: FunctionComponent<Props> = ({
  type,
  title,
  id, 
  value,
  onInput,
  disabled
}) => {
  const handleInput = function(e: Event) {
    const target = e.target as HTMLInputElement;
    let value;
    switch (type) {
      case 'int':
        value = parseInt(target.value);
        break;
      case 'float':
        value = parseFloat(target.value);
        break;
      case 'array':
        value = JSON.parse(`[ ${ target.value } ]`);
        break;
    }
    onInput(value);
  }

  return (
    <div class="Input">
      <label 
        class="Input__label"
        htmlFor={ id }
      >
        { title }
      </label>
      <input
        class="Input__entry"
        id={ id }
        type={ type === 'array' ? 'string' : 'number' }
        disabled={ disabled }
        value={ value }
        onChange={ handleInput }
      />
    </div>
  );
};

Input.defaultProps = {
  title: '',
  id: '',
  value: 0,
  type: 'int',
  onInput: (value: any) => {},
  disabled: false
};