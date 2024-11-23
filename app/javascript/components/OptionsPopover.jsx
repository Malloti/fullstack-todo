import React, {useCallback, useRef, useState} from "react";
import {Popover} from "react-tiny-popover";

function PopoverContent({ selectedFilter, filters, selectedSort, sorts, onChangeFilter, onChangeSort }) {
  const onChangeFilterCallback = useCallback((e) => onChangeFilter(e.currentTarget.value), [onChangeFilter]);
  const onChangeSortCallback = useCallback((e) => onChangeSort(e.currentTarget.value), [onChangeSort]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex gap-2">
          <div className="form-control">
            <label htmlFor="filters">Filter By:</label>
            <select name="filters" className="form-select" onChange={onChangeFilterCallback} value={selectedFilter}>
              {filters.map(filter => (<option key={filter.value} value={filter.value}>{filter.title}</option>))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="sorts">Sort By:</label>
            <select name="sorts" className="form-select" onChange={onChangeSortCallback} value={selectedSort}>
              {sorts.map(sort => (<option key={sort.value} value={sort.value}>{sort.title}</option>))}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OptionsPopover({selectedFilter, filters, selectedSort, sorts, onChangeFilter, onChangeSort}) {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef();

  return (
    <Popover isOpen={isOpen}
             content={<PopoverContent selectedFilter={selectedFilter}
                                      filters={filters}
                                      selectedSort={selectedSort}
                                      sorts={sorts}
                                      onChangeFilter={onChangeFilter}
                                      onChangeSort={onChangeSort}/>}
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
