import { h, FunctionComponent } from 'preact';

interface Props {
  title: string;
  id: string;
  value: any;
  type: 'int' | 'float' | 'array';
  onInput: (value: any) => void;
  textarea?: boolean;
  disabled?: boolean;
};

// https://stackoverflow.com/questions/26156292/trim-specific-character-from-a-string
function trim (s: string, c: string) {
  if (c === "]")
    c = "\\]";
  if (c === "\\")
    c = "\\\\";
  return s.replace(new RegExp(
    "^[" + c + "]+|[" + c + "]+$", "g"
  ), "");
}

export const Input: FunctionComponent<Props> = ({
  type,
  title,
  id, 
  value,
  onInput,
  textarea,
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
        value = JSON.parse(`[ ${ trim(target.value.trim(), ',') } ]`);
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
      {textarea && (
        <textarea
          class="Input__entry Input__entry--textarea"
          id={ id }
          type={ type === 'array' ? 'string' : 'number' }
          disabled={ disabled }
          value={ value }
          onChange={ handleInput }
        />
      )}
      {!textarea && (
        <input
          class="Input__entry"
          id={ id }
          type={ type === 'array' ? 'string' : 'number' }
          disabled={ disabled }
          value={ value }
          onChange={ handleInput }
        />
      )}
    </div>
  );
};

Input.defaultProps = {
  title: '',
  id: '',
  value: 0,
  type: 'int',
  onInput: (value: any) => {},
  textarea: false,
  disabled: false
};