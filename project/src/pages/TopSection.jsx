import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import {
  CalendarDays,
  CalendarClock,
  ArrowDownUp,
  Link2,
  Sun,
  Moon,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";

const TopSection = ({
  allTimezones,
  addNewTimezone,
  selectedDate,
  handleDateChange,
  reverseTimezones,
  isSharing,
  setIsSharing,
  isDark,
  setIsDark,
  selectedTimes,
  timezones,
}) => {
  const [includeTime, setIncludeTime] = React.useState(true);
  const [includeDate, setIncludeDate] = React.useState(true);

  const generateLink = () => {
    const baseUrl = `${window.location.origin}`;
    const params = new URLSearchParams();

    if (includeDate) {
      params.set("date", selectedDate.toISOString().split("T")[0]);
    }

    if (includeTime) {
      Object.keys(selectedTimes).forEach((zone) => {
        params.append("zones", zone);
        params.append("times", selectedTimes[zone]);
      });
    }

    return `${baseUrl}?${params.toString()}`;
  };

  const handleGoogleCalendarClick = () => {
    const startTime = moment
      .tz(selectedDate.toISOString(), timezones[Object.keys(selectedTimes)[0]])
      .format("YYYYMMDDTHHmmssZ");
    const endTime = moment
      .tz(selectedDate.toISOString(), timezones[Object.keys(selectedTimes)[0]])
      .add(1, "hour")
      .format("YYYYMMDDTHHmmssZ");

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Event&dates=${startTime}/${endTime}`;

    window.open(googleCalendarUrl, "_blank");
  };

  return (
    <div className="lg:px-12 px-4 ">
      <div
        className={`flex flex-col md:flex-row items-center justify-between p-4 md:p-5 gap-6 m-[0.1vh_1vw] ${
          isDark ? "bg-[#2c2f34]" : "bg-[#f5f5f5]"
        }`}
      >
        <Select
          className="basic-single w-auto md:w-[30vw]"
          classNamePrefix="select"
          placeholder={"Add Time Zone, City or Town"}
          isSearchable={true}
          name="timezone"
          options={allTimezones}
          onChange={addNewTimezone}
          styles={{
            container: (prev) => ({
              ...prev,
              height: "5vh",
            }),
            valueContainer: (prev) => ({
              ...prev,
              height: "6vh",
              borderRadius: "0.5vh 0 0 0.5vh",
              backgroundColor: isDark ? "#e6e9ecee" : "white",
            }),
            indicatorsContainer: (prev) => ({
              ...prev,
              borderRadius: "0 0.5vh 0.5vh 0",
              backgroundColor: isDark ? "#acb1baee" : "white",
            }),
          }}
        />
        <div className="relative flex items-center  w-full md:w-[20vw] h-[6vh] bg-white border border-gray-300 rounded-lg shadow-inner">
          <DatePicker
            className={`text-lg border-none outline-none h-[5vh] w-full md:w-[15vw] rounded-l-lg ${
              isDark ? "bg-[#2c2f34ef] text-white" : ""
            }`}
            id="date-picker"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM d, yyyy"
          />
          <label
            className={`absolute right-0 flex items-center justify-center h-full w-[5vw] border-l border-gray-300 rounded-r-lg text-xl text-[#06bcee] ${
              isDark ? "bg-[#2c2f34ef]" : "bg-[rgba(255,255,255,0.338)]"
            }`}
            htmlFor="date-picker"
          >
            <CalendarDays />
          </label>
        </div>

        <div className="flex items-center w-full md:w-[25vw] h-[6vh] border border-gray-300 rounded-lg text-xl text-[rgb(37,156,174)]">
          <div
            onClick={handleGoogleCalendarClick}
            className="flex-1 h-full flex items-center justify-center border-r border-gray-300 hover:bg-[rgba(61,194,214,0.731)] hover:text-[rgb(206,204,204)] transition-all duration-500 cursor-pointer"
          >
            <CalendarClock />
          </div>
          <div
            onClick={reverseTimezones}
            className="flex-1 h-full flex items-center justify-center border-r border-gray-300 hover:bg-[rgba(61,194,214,0.731)] hover:text-[rgb(206,204,204)] transition-all duration-500 cursor-pointer"
          >
            <ArrowDownUp />
          </div>
          <div
            onClick={() => setIsSharing(!isSharing)}
            className="flex-1 h-full flex items-center justify-center border-r border-gray-300 hover:bg-[rgba(61,194,214,0.731)] hover:text-[rgb(206,204,204)] transition-all duration-500 cursor-pointer"
          >
            <Link2 />
          </div>
          <div
            onClick={() => setIsDark((prev) => !prev)}
            className="flex-1 h-full flex items-center justify-center hover:bg-[rgba(61,194,214,0.731)] hover:text-[rgb(206,204,204)] transition-all duration-500 cursor-pointer"
          >
            {isDark ? <Sun /> : <Moon />}
          </div>
        </div>
      </div>

      {isSharing && (
        <div
          className={`p-6 m-[0.1vh_1vw] ${
            isDark ? "bg-[#2c2f34]" : "bg-[rgba(196,194,194,0.338)]"
          }`}
        >
          <input
            className="w-full h-[6vh] rounded-lg outline-none border border-gray-300 shadow-inner px-4 text-left mb-4 text-base text-gray-500"
            type="text"
            value={generateLink()}
            readOnly
          />
          <div className="flex justify-around items-center">
            <span className="flex items-center">
              <input
                type="checkbox"
                checked={includeTime}
                onChange={() => setIncludeTime(!includeTime)}
                className="mr-2"
              />
              <label>Include Time</label>
            </span>
            <span className="flex items-center">
              <input
                type="checkbox"
                checked={includeDate}
                onChange={() => setIncludeDate(!includeDate)}
                className="mr-2"
              />
              <label>Include Date</label>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSection;
