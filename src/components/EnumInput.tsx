import { h, FunctionComponent } from 'preact';

interface Props {
  title: string;
  id: string;
  options: any;
  value: any;
  disabled?: boolean;
  onInput: (value: any) => void;
};

interface Option {
  key: string;
  value: number;
};

export const EnumInput: FunctionComponent<Props> = ({
  title,
  id, 
  value,
  options,
  disabled,
  onInput,
}) => {
  const handleInput = function(e: Event) {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value);
    onInput(value);
  }

  const optionList: Option[] = [];
  for (let key in options) {
    if (isNaN(Number(key))) {
      const value = options[key];
      optionList.push({ key, value });
    }
  }

  return (
    <div class="Input">
      <label 
        class="Input__label"
        htmlFor={ id }
      >
        { title }
      </label>
      <select
        class="Input__entry"
        id={ id }
        type="number"
        disabled={ disabled }
        value={ value }
        onChange={ handleInput }
      >
        {
          optionList.map(({ key, value }) => (
            <option value={ value }>{ key }</option>
          ))
        }
      </select>
    </div>
  );
};

EnumInput.defaultProps = {
  title: '',
  id: '',
  value: 0,
  options: {},
  onInput: (value: any) => {},
  disabled: false
};