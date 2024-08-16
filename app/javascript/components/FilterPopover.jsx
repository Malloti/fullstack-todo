import React, {useCallback, useRef, useState} from "react";
import {Popover} from "react-tiny-popover";

function PopoverContent({ selectedOption, options, onChange }) {
  const onChangeCallback = useCallback((e) => onChange(e.currentTarget.value), [onChange]);

  return (
    <div className="card">
      <div className="card-body">
        <select name="filters" className="form-select" onChange={onChangeCallback} value={selectedOption}>
          {options.map(option => (<option value={option.value}>{option.title}</option>))}
        </select>
      </div>
    </div>
  );
}

export default function FilterPopover({ selectedOption, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef();

  return (
    <Popover isOpen={isOpen}
             content={<PopoverContent selectedOption={selectedOption} options={options} onChange={onChange}/>}
             onClickOutside={() => setIsOpen(false)}
             ref={ref}>
      <button type="button"
              title="Filter Tasks"
              className="btn btn-outline-info"
              onClick={() => setIsOpen(!isOpen)}>
        <i className="bi bi-filter"></i>
      </button>
    </Popover>
  );
}
