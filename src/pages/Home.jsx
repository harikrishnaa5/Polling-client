import { useEffect, useState } from "react";
import PollItem from "../components/PollItem";
import DialogComponent from "../components/DialogComponent";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../utils";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = () => {
    const navigate = useNavigate();
    const initialActions = {
        add: false,
        edit: false,
        del: false,
    };
    const [polls, setPolls] = useState([]);
    const [editPollId, setEditPollId] = useState("");
    const [user, setUser] = useState({});
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [errors, setErrors] = useState({});
    const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [selectedOption, setSelectedOption] = useState({});
    const [selectedPoll, setSelectedPoll] = useState({});
    const [formData, setFormData] = useState({
        title: "",
        options: ["", ""],
        visibility: "public",
    });
    const [action, setAction] = useState(initialActions);
    const [expiresAt, setExpiresAt] = useState("");

    useEffect(() => {
        if (formData.visibility === "public") {
            setSelectedUsers([]);
        }
        setIsPrivate(formData.visibility === "private");
    }, [formData.visibility]);
    useEffect(() => {
        const user = getUserFromToken();
        setUser(user);
        setUserRole(user?.role);
        if (user?.role === "admin") getUsers();
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const polls = await api.get("/poll");
            if (polls.data && polls.data.length > 0) {
                setLoading(false);
                setPolls(polls.data);
            } else {
                setPolls([]);
                setLoading(false);
            }
        } catch (error) {
            setPolls([]);
        }
    };
    const getUsers = async () => {
        try {
            const users = await api.get("/user");
            console.log(users, "users");
            if (users.data && users.data.length > 0) {
                setUserList(users.data);
            }
        } catch (error) {
            setUserList([]);
        }
    };

    // const fetchPollById =  async (id) => {
    //     try {
    //         const selectedPoll = await api.get(`/poll/${id}`, payload);
    //     } catch (error) {
    //         toast.error("Something went wrong");
    //     }
    // };

    const handleEdit = (id, isActive) => {
        if (!isActive) {
            toast.error("Sorry, his poll has expired");
            return;
        }
        return
        // setShowModal(true);
        // setAction((prev) => ({ ...prev, edit: true }));
        // setEditPollId(id);
        // fetchPollById(id);
    };

    const handleDelete = async (pollId) => {
        try {
            const result = await api.delete(`/poll/${pollId}`);
            if (result?.data?.message) {
                toast.success(result?.data?.message);
                fetchPolls();
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const closeVoteDialog = () => {
        setShowVoteModal(false);
        setSelectedOption({});
    };

    const handleVote = async (poll, isActive) => {
        if (!isActive) {
            toast.error("Sorry, his poll has expired");
            return;
        }
        setSelectedPoll(poll);
        setShowVoteModal(true);
    };

    function validatePollForm(formData) {

        const errors = {};
        if (!formData.title?.trim()) {
            errors.title = "Poll title is required.";
        }

        if (!Array.isArray(formData.options) || formData.options.length < 2 || formData.options.length > 4) {
            errors.options = "Poll must have 2 to 4 options.";
        } else {
            formData.options.forEach((option, idx) => {
                if (!option?.trim()) {
                    errors[`option${idx}`] = "Option cannot be empty.";
                }
            });
        }

        if (formData.visibility === "private" && selectedUsers?.length === 0) {
            errors.allowedUsers = "Allowed users are required for private polls.";
        }

        const h = Number(time.hours) || 0;
        const m = Number(time.minutes) || 0;
        const s = Number(time.seconds) || 0;
        const totalSeconds = h * 3600 + m * 60 + s;

        if (totalSeconds === 0) {
            errors.duration = "Duration must be greater than zero.";
        } else if (totalSeconds > 7200) {
            errors.duration = "Duration cannot exceed 2 hours.";
        }

        return errors;
    }

    const convertTimeToISOString = ({ hours, minutes, seconds }) => {
        const totalSeconds = (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60 + (Number(seconds) || 0);
        const expiryDate = new Date(Date.now() + totalSeconds * 1000);
        return expiryDate.toISOString();
    };

    const handleCreatePoll = async () => {
        const errors = validatePollForm(formData);
        setErrors(errors);
        if (Object.keys(errors).length > 0) return;
        const expiresAt = convertTimeToISOString(time);
        const optionsWithIds = formData.options?.map((option, index) => ({
            id: index.toString(),
            option,
        }));
        const payload = {
            ...formData,
            options: optionsWithIds,
            expiresAt,
            allowedUsers: selectedUsers,
        };
        try {
            const createPoll = await api.post("/poll/create", payload);
            if (createPoll?.data) {
                toast.success(createPoll?.data?.message);
                fetchPolls();
                handleClose();
            }
        } catch (error) {
            toast.error("Failed to save the poll");
        }
    };

    const handleClose = () => {
        setEditPollId("");
        setShowModal(false);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setAction(initialActions);
        setSelectedUsers([]);
        setErrors({});
        setFormData({ title: "", options: ["", ""], visibility: "public", expiresAt: "" });
    };

    const handleCreateClick = () => {
        setShowModal(true);
        setAction((prev) => ({
            ...prev,
            add: true,
        }));
    };

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        if (formData.options.length < 4) {
            setFormData({ ...formData, options: [...formData.options, ""] });
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData({ ...formData, options: newOptions });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const handleVoteSubmit = async (poll) => {
        const payload = {
            pollId: poll._id,
            option: selectedOption,
        };
        try {
            const response = await api.post("/poll/vote", payload);

            toast.success(response.data.message || "Your vote has been cast!");
            closeVoteDialog();
            fetchPolls()
        } catch (error) {
            const message = error.response?.data?.message || "Failed to submit your vote";
            toast.error(message);
        }
    };

    if (loading) return <div>Loading polls...</div>;

    return (
        <div className="w-full pb-6 px-6 space-y-6">
            <button onClick={handleLogout} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                Log out
            </button>
            <header className="w-1/2 mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome, {userRole === "admin" ? "Admin" : "User"}</h1>
                {userRole === "admin" && (
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        onClick={handleCreateClick}
                    >
                        Create Poll
                    </button>
                )}
            </header>

            {polls.length === 0 ? (
                <p className="text-center text-gray-600">No polls available</p>
            ) : (
                polls?.map((poll) => (
                    <PollItem
                        key={poll.id}
                        poll={poll}
                        selectedPoll={selectedPoll}
                        isAdmin={userRole === "admin"}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onVote={handleVote}
                        user={user}
                        showVoteModal={showVoteModal}
                        handleClose={closeVoteDialog}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                        handleSubmit={handleVoteSubmit}
                    />
                ))
            )}
            <ToastContainer />
            {userRole === "admin" && showModal && (
                <DialogComponent
                    showModal={showModal}
                    handleClose={handleClose}
                    formData={formData}
                    setFormData={setFormData}
                    setSelectedUsers={setSelectedUsers}
                    selectedUsers={selectedUsers}
                    edit={action.edit}
                    add={action.add}
                    handleSubmit={handleCreatePoll}
                    isPrivate={isPrivate}
                    handleOptionChange={handleOptionChange}
                    addOption={addOption}
                    removeOption={removeOption}
                    handleFormDataChange={handleFormDataChange}
                    errors={errors}
                    time={time}
                    setTime={setTime}
                    expiresAt={expiresAt}
                    userList={userList}
                    editPollId={editPollId}
                    setExpiresAt={setExpiresAt}
                />
            )}
        </div>
    );
};

export default HomePage;
