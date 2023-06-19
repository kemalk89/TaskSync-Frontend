import { useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { Dropdown } from "../dropdown/dropdown";
import { AutoCompleteAsync } from "../autocomplete-async/autocomplete-async";

export const EditableField = ({ 
  type, 
  value,
  options, 
  autoCompleteAsyncFn, autoCompleteId, autoCompleteLabelKey,
  onSave
}) => {
  const [showEditBtn, setShowEditBtn] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const renderEditMode = () => {
    if (type === 'select') {
      return (
        <Dropdown 
          size="sm" 
          options={options} 
          selectedOption={currentValue} 
          onOptionSelected={setCurrentValue} />
      );
    }
    if (type === 'autocomplete-async') {
      return (
        <AutoCompleteAsync
          labelKey={autoCompleteLabelKey}
          id={autoCompleteId}
          apiFn={autoCompleteAsyncFn}
          onChange={setCurrentValue}
        />
      );
    }
  };

  const renderValue = () => {
    if (type === 'select') {
      return value.label;
    }

    if (type === 'autocomplete-async') {
      return value.label;
    }
  }

  return (
    <>
      <div
        className="row"
        onMouseOver={() => setShowEditBtn(true)}
        onMouseLeave={() => setShowEditBtn(false)}
      >
        <div className="col-2">
          {editMode ? renderEditMode() : renderValue()}
        </div>
        <div className="col">
          {editMode && (
            <ButtonGroup size="sm">
              <Button onClick={() => setEditMode(false)}>Cancel</Button>
              <Button color="primary" onClick={() => onSave(currentValue)}>
                Save
              </Button>
            </ButtonGroup>
          )}
          <Button
            className={showEditBtn && !editMode ? "visible" : "invisible"}
            onClick={() => setEditMode(true)}
            size="sm"
          >
            Edit
          </Button>
        </div>
      </div>
    </>
  );
};
