import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createChatGroup, getAvailableChatUsers, getGroupMessages, sendGroupMessage } from './api';

const PlusIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const SendIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const MessageSquareIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);

const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const RefreshIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14"></path></svg>
);

const normalizeName = (text) => (text || '').toString().trim().toLowerCase();

const CreateGroupModal = ({ onClose, onCreateGroup, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setIsLoadingUsers(true);
                const response = await getAvailableChatUsers(searchTerm);
                setAvailableUsers(response.data || []);
            } catch (err) {
                setError('Failed to load users.');
            } finally {
                setIsLoadingUsers(false);
            }
        };
        loadUsers();
    }, [searchTerm]);

    const filteredUsers = availableUsers;

    const toggleUser = (userId) => {
        setSelectedUserIds((prev) => (
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        ));
    };

    const handleCreate = async () => {
        const trimmedName = groupName.trim();
        if (!trimmedName) {
            setError('Group name is required.');
            return;
        }

        if ((currentUser?.role || '').toLowerCase() === 'student') {
            const selectedUsers = availableUsers.filter((user) => selectedUserIds.includes(user.id));
            const hasFaculty = selectedUsers.some((user) => user.role === 'faculty');
            if (!hasFaculty) {
                setError('Students must add at least one faculty member.');
                return;
            }
        }

        try {
            setIsCreating(true);
            setError('');
            const response = await createChatGroup(trimmedName, description.trim(), selectedUserIds, []);
            onCreateGroup(response.data);
            onClose();
        } catch (err) {
            const payload = err?.response?.data;
            const message =
                payload?.non_field_errors?.[0] ||
                payload?.detail ||
                (typeof payload === 'string' ? payload : null) ||
                'Failed to create group.';
            setError(message);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col h-[65vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h3 className="text-xl font-bold">Create Group</h3>
                    <button onClick={onClose}><XIcon className="w-6 h-6 text-gray-500" /></button>
                </div>
                <div className="flex-shrink-0">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Group name"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-2"
                    />
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 mb-2"
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search users..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {(currentUser?.role || '').toLowerCase() === 'student' && (
                        <p className="text-xs text-amber-700 mt-2">You must select at least one faculty member.</p>
                    )}
                </div>
                <div className="mt-4 flex-1 overflow-y-auto">
                    {isLoadingUsers ? (
                        <p className="p-4 text-center text-gray-500">Loading users...</p>
                    ) : filteredUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <li key={user.id} onClick={() => toggleUser(user.id)} className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                                        {(user.full_name || user.first_name || user.email || 'U').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown user'}</p>
                                        <p className="text-sm text-gray-500">{user.role}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="ml-auto"
                                        checked={selectedUserIds.includes(user.id)}
                                        readOnly
                                    />
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-gray-500">No users found for this search. Try email or username.</p>
                    )}
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                <button
                    onClick={handleCreate}
                    disabled={isCreating}
                    className="mt-3 bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 disabled:opacity-60"
                >
                    {isCreating ? 'Creating...' : 'Create Group'}
                </button>
            </div>
        </div>
    );
};

const SharedMessagesPage = ({ conversations, setConversations, allMessages, setAllMessages, allUsers, currentUser }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [conversationSearch, setConversationSearch] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [chatError, setChatError] = useState('');
    const [mobileListOpen, setMobileListOpen] = useState(true);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages, activeConversationId]);

    useEffect(() => {
        if (!activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
        }
    }, [conversations, activeConversationId]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setMobileListOpen(true);
            return;
        }
        setMobileListOpen(!activeConversationId);
    }, [activeConversationId]);

    const filteredConversations = useMemo(() => {
        const q = normalizeName(conversationSearch);
        if (!q) return conversations;

        return conversations.filter((convo) => {
            const haystack = normalizeName(`${convo.name || ''} ${convo.group || ''} ${convo.lastMessage || ''}`);
            return haystack.includes(q);
        });
    }, [conversations, conversationSearch]);

    const handleConversationSelect = (id) => {
        setActiveConversationId(id);
        setChatError('');
        if (window.innerWidth < 768) {
            setMobileListOpen(false);
        }
    };

    const refreshActiveConversation = async () => {
        if (!activeConversationId) return;

        try {
            setIsRefreshing(true);
            setChatError('');
            const response = await getGroupMessages(activeConversationId);
            const messages = response.data || [];
            const normalized = messages.map((msg) => ({
                sender: msg.sender?.first_name || msg.sender?.email || msg.sender_name || 'Unknown',
                text: msg.content,
                avatar: (msg.sender?.first_name || msg.sender?.email || 'U').slice(0, 2).toUpperCase(),
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));
            setAllMessages((prev) => ({ ...prev, [activeConversationId]: normalized }));
        } catch (err) {
            console.error('Failed to refresh messages:', err);
            setChatError('Unable to refresh messages right now.');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeConversationId || isSending) return;

        try {
            setIsSending(true);
            setChatError('');
            const response = await sendGroupMessage(activeConversationId, newMessage);
            const messageToSend = {
                sender: response.data.sender?.first_name || response.data.sender?.email || 'You',
                text: response.data.content,
                avatar: currentUser?.initials || 'ME',
                time: new Date(response.data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setAllMessages((prevMessages) => {
                const currentMessages = prevMessages[activeConversationId] || [];
                return { ...prevMessages, [activeConversationId]: [...currentMessages, messageToSend] };
            });

            setConversations((prevConvos) => {
                const convoToUpdate = prevConvos.find((c) => c.id === activeConversationId);
                const otherConvos = prevConvos.filter((c) => c.id !== activeConversationId);
                const updatedConvo = { ...convoToUpdate, lastMessage: newMessage, time: 'Just now' };
                return [updatedConvo, ...otherConvos];
            });

            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            setChatError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleGroupCreated = (group) => {
        const newConversation = {
            id: group.id,
            name: group.name,
            group: group.description || 'Group',
            avatar: (group.name || 'G').charAt(0).toUpperCase(),
            lastMessage: group.last_message?.content || 'No messages yet',
            time: 'Just now'
        };

        setConversations((prev) => [newConversation, ...prev.filter((item) => item.id !== group.id)]);
        setAllMessages((prev) => ({ ...prev, [group.id]: [] }));
        setActiveConversationId(group.id);
        setIsCreateGroupModalOpen(false);
    };

    const activeConversation = conversations.find((c) => c.id === activeConversationId);
    const activeMessages = allMessages[activeConversationId] || [];
    const totalMessages = Object.values(allMessages).reduce((acc, rows) => acc + (rows?.length || 0), 0);

    const getUnreadCount = (convo) => {
        const rows = allMessages[convo.id] || [];
        if (convo.id === activeConversationId || rows.length === 0) return 0;
        return Math.min(5, rows.length % 6);
    };

    return (
        <>
            {isCreateGroupModalOpen && (
                <CreateGroupModal
                    onClose={() => setIsCreateGroupModalOpen(false)}
                    onCreateGroup={handleGroupCreated}
                    currentUser={currentUser}
                />
            )}

            <div className="flex h-[calc(100vh-6rem)] min-h-[620px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className={`${mobileListOpen ? 'flex' : 'hidden'} md:flex w-full md:w-[36%] xl:w-[32%] border-r border-gray-200 flex-col bg-gradient-to-b from-white to-slate-50`}>
                    <div className="p-5 border-b border-gray-200 flex-shrink-0 space-y-3">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                            <button onClick={() => setIsCreateGroupModalOpen(true)} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700" title="Create group">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{conversations.length} conversations</span>
                            <span>{totalMessages} total messages</span>
                        </div>
                        <input
                            type="text"
                            value={conversationSearch}
                            onChange={(e) => setConversationSearch(e.target.value)}
                            placeholder="Search by name or recent message"
                            className="w-full p-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.map((convo) => (
                            <div key={convo.id} onClick={() => handleConversationSelect(convo.id)} className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 ${convo.id === activeConversationId ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}>
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0 font-semibold">{convo.avatar}</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-800 truncate">{convo.name}</p>
                                        <p className="text-xs text-gray-500 flex-shrink-0 ml-2">{convo.time}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                                        {getUnreadCount(convo) > 0 && (
                                            <span className="ml-auto inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">{getUnreadCount(convo)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredConversations.length === 0 && <p className="px-4 py-8 text-sm text-gray-500 text-center">No conversations match your search.</p>}
                    </div>
                </div>

                <div className={`${mobileListOpen ? 'hidden' : 'flex'} md:flex w-full md:w-[64%] xl:w-[68%] flex-col ${activeConversation ? '' : 'justify-center items-center'} bg-white`}>
                    {activeConversation ? (
                        <>
                            <div className="p-4 md:p-5 border-b border-gray-200 flex items-center gap-3 h-20 md:h-24 flex-shrink-0">
                                <button onClick={() => setMobileListOpen(true)} className="md:hidden text-sm font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">Back</button>
                                <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold">{activeConversation.avatar}</div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 truncate">{activeConversation.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{activeConversation.group}</p>
                                </div>
                                <button onClick={refreshActiveConversation} disabled={isRefreshing} className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
                                    <RefreshIcon className="w-4 h-4" />
                                    {isRefreshing ? 'Refreshing' : 'Refresh'}
                                </button>
                            </div>

                            {chatError && <p className="px-5 py-2 text-sm bg-red-50 text-red-700 border-b border-red-200">{chatError}</p>}

                            <div className="flex-1 p-5 md:p-7 overflow-y-auto bg-gray-50 space-y-6">
                                {activeMessages.map((msg, index) => (
                                    <div key={index} className={`flex items-start space-x-4 ${msg.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${msg.sender === 'You' ? 'bg-indigo-200' : 'bg-gray-300'}`}>{msg.avatar}</div>
                                        <div className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                            <p className="font-semibold text-gray-800 text-sm">{msg.sender}</p>
                                            <div className={`p-3 rounded-lg mt-1 max-w-lg whitespace-pre-wrap ${msg.sender === 'You' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.text}</div>
                                            <span className="text-[11px] text-gray-500 mt-1">{msg.time || 'Just now'}</span>
                                        </div>
                                    </div>
                                ))}

                                {activeMessages.length === 0 && (
                                    <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center text-gray-500">
                                        <MessageSquareIcon className="w-14 h-14 mb-3" />
                                        <p className="font-semibold text-gray-700">No messages yet</p>
                                        <p className="text-sm">Start the conversation by sending the first message.</p>
                                    </div>
                                )}

                                <div ref={chatEndRef} />
                            </div>

                            <div className="p-4 md:p-5 bg-white border-t border-gray-200 flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        placeholder="Type a message and press Enter"
                                        className="flex-1 p-3 md:p-4 border rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button type="submit" disabled={isSending || !newMessage.trim()} className="bg-indigo-600 text-white rounded-2xl p-3 md:p-4 hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                                        <SendIcon className="w-6 h-6" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 px-6">
                            <MessageSquareIcon className="w-16 h-16 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold">Select a conversation</h2>
                            <p>Choose one of your existing conversations to start chatting.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SharedMessagesPage;
