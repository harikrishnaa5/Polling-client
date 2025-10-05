import { useState } from "react";
import VoteDialogComponent from "./VoteDialog";

const PollItem = ({
    poll,
    isAdmin,
    onEdit,
    onDelete,
    onVote,
    user,
    showVoteModal,
    handleClose,
    selectedOption,
    setSelectedOption,
    handleSubmit,
    selectedPoll,
}) => {
    const handleOptionClick = (newOpt) => {
        setSelectedOption((prev) => ({ ...prev, id: newOpt.id, option: newOpt.option }));
    };
    const isActive = new Date() < new Date(poll.expiresAt);
    let isVoted = false;
    let votedOption = {};
    if (poll.votes && poll.votes.length > 0) {
        for (let vote of poll.votes) {
            if (vote.email === user.email) {
                votedOption = vote;
                isVoted = true;
            }
        }
    }

    return (
        <div className="w-1/2 mx-auto p-4 border rounded shadow-sm bg-white mb-4 text-black">
            <h3 className="text-xl font-semibold">Q. {poll.title}</h3>
            <p className="text-sm mb-2">
                <strong>{isActive ? "Active" : "Inactive"}</strong> | Expires:{" "}
                {new Date(poll.expiresAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                })}
            </p>
            <div className="mb-2">
                Options:
                <ol className="list-decimal list-inside ml-4 ">
                    {poll.options.map((opt) => (
                        <li
                            key={opt.id}
                            className={`border text-black border-gray-400 px-3 rounded ${
                                votedOption.optionId === opt.id ? "bg-blue-400" : "bg-gray-200"
                            } cursor-pointer mb-2`}
                        >
                            {opt.option}
                        </li>
                    ))}
                </ol>
            </div>

            {isAdmin ? (
                <div className="space-x-2">
                    {isActive && (
                        <button onClick={() => onEdit(poll._id, isActive)} className="px-3 py-1 bg-blue-400 text-white rounded">
                            Edit
                        </button>
                    )}
                    <button onClick={() => onDelete(poll._id)} className="px-3 py-1 bg-red-500 text-white rounded">
                        Delete
                    </button>
                </div>
            ) : (
                <>
                    {isActive ? (
                        <button
                            disabled={isVoted}
                            onClick={() => onVote(poll, isActive)}
                            className={`px-3 py-1 ${ isVoted? "bg-gray-200 text-black" : "bg-blue-600 text-white"} rounded`}
                        >
                            {isVoted ? "Voted" : "Vote"}
                        </button>
                    ) : (
                        <button className="px-3 py-1 bg-gray-400 text-black rounded">Result</button>
                    )}
                </>
            )}
            {showVoteModal && (
                <VoteDialogComponent
                    showModal={showVoteModal}
                    handleClose={handleClose}
                    poll={selectedPoll}
                    handleOptionClick={handleOptionClick}
                    selectedOption={selectedOption}
                    handleSubmit={handleSubmit}
                />
            )}
        </div>
    );
};

export default PollItem;
