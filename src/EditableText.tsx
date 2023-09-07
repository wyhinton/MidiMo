import React, { useState, ChangeEvent, FocusEvent } from 'react';

interface EditableTextProps {
  initialText: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> 
}

const EditableText = ({ initialText, onChange }: EditableTextProps): JSX.Element => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const handleDoubleClick = () => {
    console.log("got double")
    setIsEditing(true);
  };

//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setText(event.target.value);
//   };

  const handleBlur = () => {
    setIsEditing(false);
    // Save the changes or perform any required actions here
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={initialText}
          onChange={onChange}
          onBlur={handleBlur}
        />
      ) : (
        <span>{initialText}</span>
      )}
    </div>
  );
};

export default EditableText;