import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TopSection from "./TopSection";
import TimezoneCard from "./TimezoneCard";
import { InitialTimes, InitialTimezones } from "./utils";

const TimezoneConverter = () => {
  const [selectedTimes, setSelectedTimes] = useState(InitialTimes());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reverseOrder, setReverseOrder] = useState(false);
  const [timezones, setTimezones] = useState(InitialTimezones());
  const [isDark, setIsDark] = useState(
    () => JSON.parse(localStorage.getItem("isDark")) || false
  );
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    localStorage.setItem("isDark", JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const date = params.get("date");
    if (date) {
      setSelectedDate(new Date(date));
    }
    const zones = params.getAll("zones");
    const times = params.getAll("times");
    if (zones.length && times.length && zones.length === times.length) {
      const newTimes = {};
      const newTimezones = {};
      zones.forEach((zone, index) => {
        newTimes[zone] = times[index];
        newTimezones[zone] = zone.replace(/-/g, "/");
      });
      setSelectedTimes(newTimes);
      setTimezones(newTimezones);
    }
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (zone, value) => {
    const updatedDateTime = moment(selectedDate)
      .startOf("day")
      .add(value, "minutes")
      .format("YYYY-MM-DD HH:mm");
    const updatedTimes = {
      ...selectedTimes,
      [zone]: moment(updatedDateTime).format("HH:mm"),
    };

    Object.keys(timezones).forEach((tz) => {
      if (tz !== zone) {
        updatedTimes[tz] = moment
          .tz(updatedDateTime, timezones[zone])
          .tz(timezones[tz])
          .format("HH:mm");
      }
    });

    setSelectedTimes(updatedTimes);
  };

  const addNewTimezone = (option) => {
    const label = option.value;
    const zone = label.replace(/\//g, "-");
    setTimezones({ ...timezones, [zone]: label });
    setSelectedTimes({
      ...selectedTimes,
      [zone]: moment().tz(label).format("HH:mm"),
    });
  };

  const removeTimezone = (zone) => {
    const newTimezones = { ...timezones };
    delete newTimezones[zone];
    const newSelectedTimes = { ...selectedTimes };
    delete newSelectedTimes[zone];
    setSelectedTimes(newSelectedTimes);
    setTimezones(newTimezones);
  };

  const allTimezones = moment.tz
    .names()
    .map((tz) => ({ value: tz, label: tz }));

  const reverseTimezones = () => {
    setReverseOrder(!reverseOrder);
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const oldIndex = timezoneEntries.findIndex(
        ([zone]) => zone === active.id
      );
      const newIndex = timezoneEntries.findIndex(([zone]) => zone === over.id);

      const reorderedEntries = arrayMove(timezoneEntries, oldIndex, newIndex);
      setSelectedTimes(Object.fromEntries(reorderedEntries));
    }
  };

  let timezoneEntries = Object.entries(selectedTimes);

  if (reverseOrder) {
    timezoneEntries = timezoneEntries.reverse();
  }

  return (
    <div
      className={`flex flex-col justify-center min-h-screen ${
        isDark ? "bg-[#131416]" : ""
      }`}
    >
      <TopSection
        allTimezones={allTimezones}
        addNewTimezone={addNewTimezone}
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        reverseTimezones={reverseTimezones}
        isSharing={isSharing}
        setIsSharing={setIsSharing}
        isDark={isDark}
        setIsDark={setIsDark}
        selectedTimes={selectedTimes}
        timezones={timezones}
      />

      <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <div className="px-[5vw] py-[1vh]">
          <SortableContext
            items={timezoneEntries.map(([zone]) => zone)}
            strategy={verticalListSortingStrategy}
          >
            {timezoneEntries.map(([zone, time]) => (
              <TimezoneCard
                key={zone}
                zone={zone}
                time={time}
                selectedDate={selectedDate}
                handleTimeChange={handleTimeChange}
                removeTimezone={removeTimezone}
                timezones={timezones}
                isDark={isDark}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default TimezoneConverter;
