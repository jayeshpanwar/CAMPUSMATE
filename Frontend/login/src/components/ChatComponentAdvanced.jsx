import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MainContainer,
  ChatContainer,
  ConversationHeader,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationList,
  Conversation,
  Search,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import ChatUISetup from './ChatUISetup';
import apiClient from "./api";
import "./ChatComponentAdvanced.css";

function ChatComponentAdvanced() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const pollingIntervalRef = useRef(null);

  const userId = localStorage.getItem("user_id");
  const userName = localStorage.getItem("user_name");

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Set up message polling when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Fetch messages immediately
      fetchMessagesForConversation(selectedConversation.id);
      
      // Set up polling interval to fetch new messages every 2 seconds
      pollingIntervalRef.current = setInterval(() => {
        fetchMessagesForConversation(selectedConversation.id);
      }, 2000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/chat/groups/");
      const groupsData = response.data || [];
      
      // Map groups to conversation format
      const formattedConversations = groupsData.map(group => ({
        id: group.id,
        name: group.name,
        description: group.description || "",
        avatar: "👥",
        messages: [],
        participants: group.memberships ? group.memberships.length : 0,
      }));
      
      setConversations(formattedConversations);
      if (formattedConversations.length > 0) {
        setSelectedConversation(formattedConversations[0]);
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessagesForConversation = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const response = await apiClient.get(`/chat/groups/${conversationId}/messages/`);
      const messagesData = response.data || [];
      
      // Format messages for the UI
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id,
        sender: msg.sender_name || msg.sender,
        direction: msg.sender_id === parseInt(userId) ? "outgoing" : "incoming",
        position: "single",
        text: msg.content,
        timestamp: msg.created_at,
      }));
      
      // Update the selected conversation with messages
      setSelectedConversation(prev => {
        if (prev && prev.id === conversationId) {
          return {
            ...prev,
            messages: formattedMessages,
          };
        }
        return prev;
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (messageInput.trim() === "" || !selectedConversation) return;

    try {
      const messageContent = messageInput;
      setMessageInput("");
      setIsTyping(true);

      // Send message to backend
      const response = await apiClient.post(
        `/chat/groups/${selectedConversation.id}/send_message/`,
        { content: messageContent }
      );

      // After sending, fetch updated messages
      await fetchMessagesForConversation(selectedConversation.id);
      
      setIsTyping(false);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
      setIsTyping(false);
      // Re-add the message to input if send failed
      setMessageInput(messageInput);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setError(null);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="loading-spinner"></div>
        <p>Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="chat-wrapper-advanced">
      <ChatUISetup />
      <div className="campus-header-advanced">
        <div className="header-content">
          <div className="header-title">
            <h1>💬 CampusMate Messages</h1>
            <p>Stay connected with your campus community</p>
          </div>
          <div className="header-stats">
            <span className="stat">
              <strong>{conversations.length}</strong> Conversations
            </span>
            <span className="stat">
              <strong>{conversations.reduce((acc, c) => acc + (c.participants || 0), 0)}</strong> Total Participants
            </span>
          </div>
        </div>
      </div>

      <div className="chat-main">
        <MainContainer className="chat-container-advanced">
          <div className="conversations-sidebar-advanced">
            <ConversationList>
              <Search
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(val) => setSearchQuery(val)}
                onClearClick={() => setSearchQuery("")}
              />

              {filteredConversations.length === 0 ? (
                <div className="no-conversations">
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <Conversation
                    key={conversation.id}
                    name={conversation.name}
                    lastSenderName={conversation.messages[0]?.sender || ""}
                    lastMessage={
                      conversation.messages[0]?.text || conversation.description || "No messages"
                    }
                    active={selectedConversation?.id === conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    info={`${conversation.participants || 0} participants`}
                  >
                    <Avatar src={conversation.avatar} name={conversation.name} />
                  </Conversation>
                ))
              )}
            </ConversationList>
          </div>

          <ChatContainer className="chat-container-content">
            {selectedConversation ? (
              <>
                <ConversationHeader>
                  <ConversationHeader.Back
                    onClick={() => setSelectedConversation(null)}
                  />
                  <Avatar
                    src={selectedConversation.avatar}
                    name={selectedConversation.name}
                  />
                  <ConversationHeader.Content
                    userName={selectedConversation.name}
                    info={`${selectedConversation.participants || 0} members`}
                  />
                  <ConversationHeader.Actions>
                    <button className="action-btn" title="Call">
                      📞
                    </button>
                    <button className="action-btn" title="Video">
                      📹
                    </button>
                    <button className="action-btn" title="Info">
                      ℹ️
                    </button>
                  </ConversationHeader.Actions>
                </ConversationHeader>

                <MessageList>
                  {selectedConversation.messages.length === 0 ? (
                    <div className="empty-messages">
                      <div className="empty-icon">💬</div>
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    selectedConversation.messages.map((message) => (
                      <Message
                        key={message.id}
                        model={{
                          message: message.text,
                          sentTime: message.timestamp || "now",
                          sender: message.sender,
                          direction: message.direction,
                          position: message.position,
                        }}
                      >
                        <Avatar
                          src={
                            message.direction === "incoming"
                              ? selectedConversation.avatar
                              : "😊"
                          }
                          name={message.sender}
                        />
                      </Message>
                    ))
                  )}
                  {isTyping && (
                    <Message
                      model={{
                        message: "",
                        sentTime: "just now",
                        sender: selectedConversation.name,
                        direction: "incoming",
                        position: "single",
                      }}
                    >
                      <Avatar
                        src={selectedConversation.avatar}
                        name={selectedConversation.name}
                      />
                      <Message.CustomContent>
                        <TypingIndicator />
                      </Message.CustomContent>
                    </Message>
                  )}
                </MessageList>

                {error && <div className="error-banner">{error}</div>}

                <MessageInput
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(val) => setMessageInput(val)}
                  onSend={handleSendMessage}
                  attachButton={false}
                />
              </>
            ) : (
              <div className="no-conversation-selected">
                <div className="empty-state-icon">👋</div>
                <h2>Select a conversation to start chatting</h2>
                <p>Choose from your conversations on the left</p>
              </div>
            )}
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default ChatComponentAdvanced;
