import React, { useState, useEffect, useRef } from 'react';
import { sendGroupMessage } from './api';

// Icons
const PlusIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);

const SendIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);

const MessageSquareIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const XIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const NewConversationModal = ({ onClose, onStartConversation, allUsers, currentUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const filteredUsers = allUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) && user.name !== currentUser.name);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md flex flex-col h-[60vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0"><h3 className="text-xl font-bold">New Conversation</h3><button onClick={onClose}><XIcon className="w-6 h-6 text-gray-500" /></button></div>
                 <div className="flex-shrink-0"><input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search for users..." className="w-full border border-gray-300 rounded-md shadow-sm p-2" /></div>
                <div className="mt-4 flex-1 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <li key={user.name} onClick={() => onStartConversation(user)} className="p-3 flex items-center space-x-3 hover:bg-gray-50 cursor-pointer rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">{user.initials}</div>
                                    <div><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-500">{user.role}</p></div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-gray-500">No users found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const SharedMessagesPage = ({ conversations, setConversations, allMessages, setAllMessages, allUsers, currentUser }) => {
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [isNewConvoModalOpen, setIsNewConvoModalOpen] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [allMessages, activeConversationId]);

    useEffect(() => {
        if (!activeConversationId && conversations.length > 0) {
            setActiveConversationId(conversations[0].id);
        }
    }, [conversations, activeConversationId]);
    
    const handleConversationSelect = (id) => { setActiveConversationId(id); };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !activeConversationId) return;
        
        try {
            // Send message to backend API
            const response = await sendGroupMessage(activeConversationId, newMessage);
            
            // Create message object from response
            const messageToSend = {
                sender: response.data.sender?.first_name || response.data.sender?.email || 'You',
                text: response.data.content,
                avatar: currentUser.initials,
                time: new Date(response.data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            // Update local state
            setAllMessages(prevMessages => {
                const currentMessages = prevMessages[activeConversationId] || [];
                return { ...prevMessages, [activeConversationId]: [...currentMessages, messageToSend] };
            });
            
            setConversations(prevConvos => {
                const convoToUpdate = prevConvos.find(c => c.id === activeConversationId);
                const otherConvos = prevConvos.filter(c => c.id !== activeConversationId);
                const updatedConvo = { ...convoToUpdate, lastMessage: newMessage, time: 'Just now' };
                return [updatedConvo, ...otherConvos];
            });
            
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
            alert('Failed to send message. Please try again.');
        }
    };
    
    const startNewConversation = (user) => {
        const newId = conversations.length > 0 ? Math.max(...conversations.map(c => c.id)) + 1 : 1;
        const newConversation = {
            id: newId,
            name: user.name,
            group: 'Direct Message',
            avatar: user.initials,
            lastMessage: 'Conversation started.',
            time: 'Just now'
        };
        setConversations(prev => [newConversation, ...prev]);
        setAllMessages(prev => ({...prev, [newId]: [] }));
        setActiveConversationId(newId);
        setIsNewConvoModalOpen(false);
    };

    const activeConversation = conversations.find(c => c.id === activeConversationId);
    const activeMessages = allMessages[activeConversationId] || [];

    return (
        <>
            {isNewConvoModalOpen && (
                <NewConversationModal onClose={() => setIsNewConvoModalOpen(false)} onStartConversation={startNewConversation} allUsers={allUsers} currentUser={currentUser} />
            )}
            <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl shadow-md overflow-hidden">
                <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                            <button onClick={() => setIsNewConvoModalOpen(true)} className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700">
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <input type="text" placeholder="Search Messages" className="w-full mt-4 p-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map(convo => (
                            <div key={convo.id} onClick={() => handleConversationSelect(convo.id)} className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 ${convo.id === activeConversationId ? 'bg-indigo-50 border-r-4 border-indigo-600' : ''}`}>
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl flex-shrink-0">{convo.avatar}</div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center"><p className="font-semibold text-gray-800 truncate">{convo.name}</p><p className="text-xs text-gray-500 flex-shrink-0 ml-2">{convo.time}</p></div>
                                    <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`w-2/3 hidden md:flex flex-col ${activeConversation ? '' : 'justify-center items-center'}`}>
                    {activeConversation ? (
                        <>
                            <div className="p-4 border-b border-gray-200 flex items-center space-x-3 h-20 flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">{activeConversation.avatar}</div>
                                <div><h3 className="font-bold text-gray-800">{activeConversation.name}</h3><p className="text-sm text-gray-500">{activeConversation.group}</p></div>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-6">
                                {activeMessages.map((msg, index) => (
                                    <div key={index} className={`flex items-start space-x-4 ${msg.sender === 'You' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${msg.sender === 'You' ? 'bg-indigo-200' : 'bg-gray-300'}`}>{msg.avatar}</div>
                                        <div className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                            <p className="font-semibold text-gray-800 text-sm">{msg.sender}</p>
                                            <div className={`p-3 rounded-lg mt-1 max-w-lg whitespace-pre-wrap ${msg.sender === 'You' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.text}</div>
                                        </div>
                                    </div>
                                ))}
                                 <div ref={chatEndRef} />
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 p-3 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                    <button type="submit" className="bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 transition-colors"><SendIcon className="w-6 h-6" /></button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500"><MessageSquareIcon className="w-16 h-16 mx-auto mb-4" /><h2 className="text-xl font-semibold">Select a conversation</h2><p>Choose one of your existing conversations to start chatting.</p></div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SharedMessagesPage;
