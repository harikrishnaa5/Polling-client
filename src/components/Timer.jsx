import { useState, useEffect } from "react";

const MAX_SECONDS = 2 * 60 * 60;

const TimerSelector = ({ expiresAt, setExpiresAt, time, setTime }) => {
    const parseExpiresAt = () => {
        if (!expiresAt) return { hours: 0, minutes: 0, seconds: 0 };
        const now = new Date();
        const expiry = new Date(expiresAt);
        let totalSec = Math.max(0, Math.floor((expiry - now) / 1000));
        totalSec = Math.min(totalSec, MAX_SECONDS);
        const h = Math.floor(totalSec / 3600);
        const m = Math.floor((totalSec % 3600) / 60);
        const s = totalSec % 60;
        return { hours: h, minutes: m, seconds: s };
    };

    useState(() => {
        if (!Object.values(time).some(Boolean)) {
            setTime(parseExpiresAt());
        }
    }, []);

    useEffect(() => {
        const totalSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
        const clampedSeconds = Math.min(totalSeconds, MAX_SECONDS);
        const newExpiry = new Date(Date.now() + clampedSeconds * 1000);
        setExpiresAt(newExpiry.toISOString().slice(0, 16));
    }, [time, setExpiresAt]);

    const onChange = (e) => {
        const { name, value } = e.target;
        let val = parseInt(value, 10);
        if (isNaN(val) || val < 0) val = 0;
        if (name === "hours") val = Math.min(val, 2);
        if (name === "minutes" || name === "seconds") val = Math.min(val, 59);
        const newTime = { ...time, [name]: val };

        const totalSec = newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds;

        if (totalSec > MAX_SECONDS) {
            if (name === "seconds") {
                newTime.seconds = MAX_SECONDS - newTime.hours * 3600 - newTime.minutes * 60;
            } else if (name === "minutes") {
                newTime.minutes = Math.floor((MAX_SECONDS - newTime.hours * 3600) / 60);
                newTime.seconds = 0;
            } else if (name === "hours") {
                newTime.hours = 2;
                newTime.minutes = 0;
                newTime.seconds = 0;
            }
        }
        setTime(newTime);
    };

    return (
        <div className="flex items-center gap-3">
            <input
                type="number"
                name="hours"
                min="0"
                max="2"
                value={time.hours}
                onChange={onChange}
                className="w-16 px-2 py-1 border border-black rounded text-black"
                aria-label="Hours"
            />
            <span className="text-black">h</span>
            <input
                type="number"
                name="minutes"
                min="0"
                max="59"
                value={time.minutes}
                onChange={onChange}
                className="w-16 px-2 py-1 border rounded text-black"
                aria-label="Minutes"
            />
            <span className="text-black">m</span>
            <input
                type="number"
                name="seconds"
                min="0"
                max="59"
                value={time.seconds}
                onChange={onChange}
                className="w-16 px-2 py-1 border rounded text-black"
                aria-label="Seconds"
            />
            <span className="text-black">s</span>
        </div>
    );
};

export default TimerSelector;
