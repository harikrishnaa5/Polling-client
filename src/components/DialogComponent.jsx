import MultiSelectDropdown from "./CustomDropdown";
import TimerSelector from "./Timer";

const DialogComponent = ({
    showModal,
    editPollId,
    handleFormDataChange,
    handleClose,
    handleSubmit,
    formData,
    expiresAt,
    setExpiresAt,
    handleOptionChange,
    addOption,
    removeOption,
    isPrivate,
    errors,
    time,
    setTime,
    userList,
    selectedUsers,
    setSelectedUsers,
    edit,
    add,
}) => {
    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-[#4d4d4da7] p-6 transition-opacity duration-200 ease-in-out ${
                showModal ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full md:w-[620px] max-h-[98vh] overflow-auto bg-white px-8 py-6 rounded-md flex flex-col gap-2.5"
            >
                <span className="flex justify-between">
                    <h2 className="text-2xl text-black font-semibold">{add ? "Create Poll" : edit ? "Edit Poll" : ""}</h2>
                    <button
                        onClick={handleClose}
                        aria-label="Close dialog"
                        className="self-end text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        &#x2715;
                    </button>
                </span>
                <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                    Title
                </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleFormDataChange}
                    autoComplete="off"
                    className="w-full border border-black text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && <div className="text-red-600 text-sm">{errors.title}</div>}

                <label className="text-sm font-semibold text-gray-700">Options (2-4)</label>
                {formData.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            autoComplete="off"
                            className="flex-grow border border-black text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors[`option${index}`] && <div className="text-red-600 text-sm">{errors[`option${index}`]}</div>}
                        <button
                            type="button"
                            onClick={() => removeOption(index)}
                            disabled={formData.options.length <= 2}
                            className={`px-2 py-1 rounded ${
                                formData.options.length <= 2
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-red-600 hover:bg-red-100"
                            }`}
                            aria-label="Remove option"
                        >
                            &times;
                        </button>
                    </div>
                ))}

                {formData.options?.length < 4 && (
                    <button
                        type="button"
                        onClick={addOption}
                        className="self-start bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                    >
                        + Add Option
                    </button>
                )}

                <label htmlFor="visibility" className="text-sm font-semibold text-gray-700">
                    Visibility
                </label>
                <select
                    id="visibility"
                    name="visibility"
                    value={formData.visibility || "public"}
                    onChange={handleFormDataChange}
                    className="w-full border border-black text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                {/* {isPrivate && (
                    <>
                        <label htmlFor="allowedUsers" className="text-sm font-semibold text-gray-700">
                            Allowed Users (comma separated emails)
                        </label>
                        <input
                            id="allowedUsers"
                            type="text"
                            name="allowedUsers"
                            autoComplete="off"
                            value={formData.allowedUsers || ""}
                            onChange={handleFormDataChange}
                            className="w-full border text-black border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {errors.allowedUsers && <div className="text-red-600 text-sm">{errors.allowedUsers}</div>}
                    </>
                )} */}
                {isPrivate && (
                    <>
                        <label htmlFor="allowedUsers" className="text-sm font-semibold text-gray-700">
                            Allowed Users
                        </label>

                        <MultiSelectDropdown
                            userList={userList}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                        />
                        {errors.allowedUsers && <div className="text-red-600 text-sm">{errors.allowedUsers}</div>}
                    </>
                )}

                <label htmlFor="expiresAt" className="text-sm font-semibold text-gray-700">
                    Expiry (within 2 hours)
                </label>
                <TimerSelector expiresAt={expiresAt} setExpiresAt={setExpiresAt} time={time} setTime={setTime} />
                {errors.duration && <div className="text-red-600 text-sm">{errors.duration}</div>}

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-5 py-2 border border-gray-400 text-black rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        {add ? "Create Poll" : edit ? "Update Poll" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DialogComponent;
