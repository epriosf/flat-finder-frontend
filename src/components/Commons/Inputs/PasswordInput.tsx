import { FloatLabel } from 'primereact/floatlabel';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Password } from 'primereact/password';

interface PasswordInputProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iconClass: string;
  label: string;
  disabled?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  name,
  value,
  onChange,
  iconClass,
  label,
  disabled = false,
}) => (
  <FloatLabel>
    <IconField iconPosition="left" className="w-full">
      <InputIcon className={iconClass}> </InputIcon>
      <Password
        id={id}
        name={name}
        value={value}
        className="w-full text-500"
        onChange={onChange}
        feedback={false}
        toggleMask={!disabled}
        disabled={disabled}
      />
    </IconField>
    <label htmlFor={id} className="left-3 text-400">
      {label}
    </label>
  </FloatLabel>
);

export default PasswordInput;
