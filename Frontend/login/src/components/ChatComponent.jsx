import React, { useState, useEffect } from "react";
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
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./ChatComponent.css";

function ChatComponent() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Campus Support",
      avatar: "👨‍💼",
      active: true,
      messages: [
        {
          id: 1,
          sender: "Campus Support",
          direction: "incoming",
          position: "single",
          text: "Welcome to CampusMate! How can we help you today?",
        },
      ],
    },
    {
      id: 2,
      name: "Course Discussion",
      avatar: "👨‍🎓",
      active: false,
      messages: [
        {
          id: 1,
          sender: "Prof. Smith",
          direction: "incoming",
          position: "single",
          text: "Don't forget about the assignment due this Friday!",
        },
      ],
    },
    {
      id: 3,
      name: "Hostel Group",
      avatar: "🏘️",
      active: false,
      messages: [],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;

    const newMessage = {
      id: selectedConversation.messages.length + 1,
      sender: "You",
      direction: "outgoing",
      position: "single",
      text: messageInput,
    };

    setSelectedConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    setMessageInput("");

    // Simulate incoming response after 1 second
    setTimeout(() => {
      const responseMessage = {
        id: selectedConversation.messages.length + 2,
        sender: selectedConversation.name.split(" ")[0],
        direction: "incoming",
        position: "single",
        text: "Thanks for your message! We'll get back to you soon.",
      };

      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, responseMessage],
      }));
    }, 1000);
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="chat-wrapper">
      <div className="campus-header">
        <div className="header-content">
          <h1>💬 CampusMate Messages</h1>
          <p>Connect with your campus community</p>
        </div>
      </div>

      <MainContainer className="chat-container">
        <div className="conversations-sidebar">
          <ConversationList>
            <Search
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              onClearClick={() => setSearchQuery("")}
            />

            {filteredConversations.map((conversation) => (
              <Conversation
                key={conversation.id}
                name={conversation.name}
                lastSenderName={
                  conversation.messages[conversation.messages.length - 1]?.sender || ""
                }
                lastMessage={
                  conversation.messages[conversation.messages.length - 1]?.text ||
                  "No messages yet"
                }
                active={selectedConversation.id === conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                info={conversation.active ? "Online" : "Offline"}
              >
                <Avatar src={conversation.avatar} name={conversation.name} />
              </Conversation>
            ))}
          </ConversationList>
        </div>

        <ChatContainer>
          {selectedConversation && (
            <>
              <ConversationHeader>
                <ConversationHeader.Back />
                <Avatar
                  src={selectedConversation.avatar}
                  name={selectedConversation.name}
                />
                <ConversationHeader.Content
                  userName={selectedConversation.name}
                  info={selectedConversation.active ? "Active now" : "Offline"}
                />
              </ConversationHeader>

              <MessageList>
                {selectedConversation.messages.map((message) => (
                  <Message
                    key={message.id}
                    model={{
                      message: message.text,
                      sentTime: "now",
                      sender: message.sender,
                      direction: message.direction,
                      position: message.position,
                    }}
                  >
                    <Avatar
                      src={selectedConversation.avatar}
                      name={message.sender}
                    />
                  </Message>
                ))}
              </MessageList>

              <MessageInput
                placeholder="Type a message..."
                value={messageInput}
                onChange={(val) => setMessageInput(val)}
                onSend={handleSendMessage}
              />
            </>
          )}
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default ChatComponent;
