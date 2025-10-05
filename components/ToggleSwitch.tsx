import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, id }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox hidden"
        id={id || `react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? '#1B74E4' : '#E9E9E9' }}
        className="react-switch-label flex items-center justify-between cursor-pointer w-12 h-6 rounded-full relative transition-colors"
        htmlFor={id || `react-switch-new`}
      >
        <span
          className={`react-switch-button absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
            isOn ? 'translate-x-6' : ''
          }`}
        />
      </label>
    </>
  );
};

export default ToggleSwitch;
