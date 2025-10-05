import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({ userList, selectedUsers, setSelectedUsers }) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleUser = (email) => {
        if (selectedUsers.includes(email)) {
            setSelectedUsers(selectedUsers.filter((u) => u !== email));
        } else {
            setSelectedUsers([...selectedUsers, email]);
        }
    };

    return (
        <div className="relative inline-block w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full border text-black border-gray-300 rounded px-3 py-2 text-left flex justify-between items-center bg-white"
            >
                {selectedUsers.length > 0
                    ? `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""} selected`
                    : "Select users"}
                <span className="ml-2">&#x25BC;</span>
            </button>

            {open && (
                <ul className="absolute z-10 mt-1 max-h-28 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
                    {userList.map(({ fullName, email }) => {
                        const checked = selectedUsers.includes(email);
                        return (
                            <li
                                key={email}
                                onClick={() => toggleUser(email)}
                                className={`flex text-black items-center gap-2 px-3 py-2 cursor-pointer select-none ${
                                    checked ? "bg-blue-500 text-white" : "hover:bg-blue-100"
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleUser(email)}
                                    className="pointer-events-none"
                                />
                                <span>{`${fullName} - ${email}`}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
