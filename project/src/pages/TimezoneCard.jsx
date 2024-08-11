import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import Slider from "react-slider";
import Select from "react-select";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SliderMarks,
  TimeOptions,
  TimezoneAbbr,
  TimezoneOffset,
} from "./utils";
import "./TimezoneCard.css"; // Importing the CSS file

const TimezoneCard = ({
  zone,
  time,
  selectedDate,
  handleTimeChange,
  removeTimezone,
  timezones,
  isDark,
}) => {
  const [localTime, setLocalTime] = useState(
    moment.duration(time, "HH:mm").asMinutes()
  );

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: zone });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const handleSliderChange = (value) => {
    setLocalTime(value);
  };

  const handleSliderChangeComplete = (value) => {
    handleTimeChange(zone, value);
  };

  const handleTimeSelectChange = (selectedOption) => {
    setLocalTime(moment.duration(selectedOption.value).asMinutes());
    handleTimeChange(zone, moment.duration(selectedOption.value).asMinutes());
  };

  useEffect(() => {
    setLocalTime(moment.duration(time, "HH:mm").asMinutes());
  }, [time]);

  const formatDisplayTime = (zone, minutes) => {
    const updatedDateTime = moment(selectedDate)
      .startOf("day")
      .add(minutes, "minutes")
      .format("YYYY-MM-DD HH:mm");
    return moment.tz(updatedDateTime, timezones[zone]).format("h:mm A");
  };

  const formatDisplayDate = (zone, minutes) => {
    const updatedDateTime = moment(selectedDate)
      .startOf("day")
      .add(minutes, "minutes")
      .format("YYYY-MM-DD HH:mm");
    return moment.tz(updatedDateTime, timezones[zone]).format("ddd D, MMMM");
  };

  const labels = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
  const timeOptions = TimeOptions();

  return (
    <div
      className={`timezone-card ${isDark ? "dark" : ""}`}
      ref={setNodeRef}
      style={style}
    >
      <div className="timezone-card-content">
        <div
          className="grip-icon"
          {...listeners}
          {...attributes}
        >
          <GripVertical size={18} />
          <GripVertical size={18} />
          <GripVertical size={18} />
          <GripVertical size={18} />
        </div>
        <div className="timezone-info">
          <h1 className={isDark ? "dark" : "light"}>
            {TimezoneAbbr(timezones[zone])}
          </h1>
          <p>{zone.replace(/-/g, "/")}</p>
        </div>
        <div className="time-picker-container">
          <Select
            className="time-picker"
            classNamePrefix="select"
            placeholder={formatDisplayTime(zone, localTime)}
            value={timeOptions.find(
              (option) =>
                moment.duration(option.value).asMinutes() === localTime
            )}
            options={timeOptions}
            onChange={handleTimeSelectChange}
            styles={{
              indicatorsContainer: () => ({ display: "none" }),
            }}
          />
          <span className="timezone-extra">
            <span>{TimezoneOffset(zone)}</span>
            <span>{formatDisplayDate(zone, localTime)}</span>
          </span>
        </div>
        <button
          className="remove-timezone-button"
          onClick={() => removeTimezone(zone)}
        >
          x
        </button>
      </div>
      <div className="time-slider-container">
        <Slider
          className="time-slider"
          thumbClassName="time-thumb"
          trackClassName={`time-track ${isDark ? "dark" : "light"}`}
          markClassName="time-mark"
          marks={SliderMarks()}
          min={0}
          max={1440}
          step={15}
          value={localTime}
          onChange={handleSliderChange}
          onAfterChange={handleSliderChangeComplete}
          renderThumb={(props, state) => <div {...props}>||</div>}
          renderMark={(props) => <span {...props} />}
        />
      </div>
      {labels && (
        <div className="labels">
          {SliderMarks()
            .filter((mark, index) => mark % 180 === 0)
            .map((mark, index) => (
              <div key={mark}>{labels[index]}</div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TimezoneCard;
