import { Icon } from '@iconify/react';
import classNames from 'classnames';
import './Dropdown.scss';
import { IsMouseOutsideOf } from '../consts/html';
import useEvent from '../hooks/useEvent';

interface DropdownProps {
  unique: string;
  options: string[];
  descriptions?: string[];
  selectedOption: string;
  setSelectedOption: (option: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  label?: string;
  menuHeader: string;
  buttonStyle?: { [key: string]: string };
  menuStyle?: { [key: string]: string };
  style?: { [key: string]: string };
  justifyContent?: 'center' | 'space-between' | 'flex-end' | 'flex-start';
  dropdownLeft?: boolean;
  dropdownGap?: string;
  disabled?: boolean;
}

const Dropdown = (props: DropdownProps) => {
  const loadOptions = () => {
    return props.options.map((option, index) => (
      <div
        key={index}
        className="menu-item"
        onClick={() => {
          props.setSelectedOption(option);
          props.setIsOpen(false);
        }}>
        <div className="item-heading">
          {option}
          {props.selectedOption === option && (
            <div className="div">SELECTED</div>
          )}
        </div>
        {props.descriptions && props.descriptions[index] && (
          <div className="item-description">{props.descriptions[index]}</div>
        )}
      </div>
    ));
  };

  const handleClick = (e: PointerEvent) => {
    const dropdownEl = document.getElementById(`droppy-${props.unique}`);
    if (!dropdownEl) return;

    if (IsMouseOutsideOf(e, dropdownEl) && props.isOpen) {
      props.setIsOpen(false);
      e.preventDefault();
    }
  };

  useEvent('click', handleClick, [props.isOpen]);

  return (
    <div
      className={classNames('dropdown', props.disabled ? 'disabled' : '')}
      style={props.style}>
      <div
        id={`droppy-${props.unique}`}
        className={classNames(
          'dropdown-btn',
          props.isOpen ? 'open' : '',
          props.disabled ? 'disabled' : ''
        )}
        style={{ ...props.buttonStyle, justifyContent: props.justifyContent }}
        onClick={() => props.setIsOpen(!props.isOpen)}>
        {props.label && <div>{props.label + ': '}</div>}
        <div className="selected-option">{props.selectedOption}</div>
        <div className="spacer" />
        <Icon icon={props.isOpen ? 'ep:arrow-up-bold' : 'ep:arrow-down-bold'} />
      </div>
      <div
        id="dropdown-menu"
        className={classNames(
          'dropdown-menu',
          'export-ignore',
          props.isOpen ? '' : 'hidden',
        )}
        style={{
          ...props.menuStyle,
          marginTop: props.dropdownGap,
          left: props.dropdownLeft ? 0 : 'auto',
        }}>
        <div className="header">{props.menuHeader}</div>
        {loadOptions()}
      </div>
    </div>
  );
};

export default Dropdown;
