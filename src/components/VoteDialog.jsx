const VoteDialogComponent = ({ showModal, handleClose, poll, selectedOption, handleOptionClick, handleSubmit }) => {
    return (
        <div
            className={`fixed inset-0 flex justify-center items-center bg-[#4d4d4da7] p-6 transition-opacity duration-200 ease-in-out ${
                showModal ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full md:w-[620px] max-h-[60vh] overflow-auto bg-white px-8 py-6 rounded-md flex flex-col gap-2.5"
            >
                <span className="flex justify-between">
                    <h2 className="text-2xl text-black font-semibold">Select an option</h2>
                    <button
                        onClick={handleClose}
                        aria-label="Close dialog"
                        className="self-end text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        &#x2715;
                    </button>
                </span>
                <ol className="list-decimal list-inside ml-4 mt-4">
                    {poll.options.map((opt) => (
                        <li
                            key={opt.id}
                            onClick={() => handleOptionClick(opt)}
                            className={`border text-black border-gray-400 px-3 rounded hover:bg-blue-400 ${
                                selectedOption.id === opt.id ? "bg-blue-400" : "bg-gray-200"
                            } cursor-pointer mb-2`}
                        >
                            {opt.option}
                        </li>
                    ))}
                </ol>
                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => handleSubmit(poll)}
                        className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VoteDialogComponent;
