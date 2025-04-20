import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  MessageSquare,
  Users,
  X,
  Send,
  Info
} from 'lucide-react';
import {
  LiveKitRoom,
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  useChat,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import axios from 'axios';


const ParticipantsPanel = ({ onClose }) => {
  const participants = useParticipants();
  const room = useRoomContext();
  const localParticipant = room.localParticipant;

  return (
    <div className="participants-area">
      <div className="chat-sidebar-header">
        <h3>Participants ({participants.length})</h3>
        <button
          className="close-chat-btn"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>
      <div className="participants-list">
        <div className="participant-item">
          <div className="participant-avatar">
            {localParticipant.identity.charAt(0).toUpperCase()}
          </div>
          <div className="participant-info">
            <span className="participant-name">
              {localParticipant.identity} (You)
            </span>
            <span className="participant-status">
              {localParticipant.isSpeaking ? 'Speaking' : 'Online'}
            </span>
          </div>
        </div>

        {participants.filter(p => !p.isLocal).map(participant => (
          <div className="participant-item" key={participant.sid}>
            <div className="participant-avatar">
              {participant.identity.charAt(0).toUpperCase()}
            </div>
            <div className="participant-info">
              <span className="participant-name">{participant.identity}</span>
              <span className="participant-status">
                {participant.isSpeaking ? 'Speaking' : 'Online'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideoChat = ({
  roomId,
  video,
  audio,
  user
}) => {
  const [token, setToken] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const navigate = useNavigate();
  const API_URL = "https://vcall-2vlg.onrender.com/"


  useEffect(() => {
    if (!user?.name) return;

    const name = user.name;
    const authToken = localStorage.getItem("authToken");

    (async () => {
      try {
        const resp = await axios.get(
          API_URL + `/api/livekit?room=${roomId}&username=${name}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );
        setToken(resp.data.token);
      } catch (e) {
        console.log(e);
      }
    })()
  }, [user?.name, roomId]);

  const onLeave = () => {
    navigate('/');
  };

  if (token === "") {
    return (
      <div className="loading-container">
        <Loader2 className="loader-icon animate-spin" size={36} />
        <p className="loading-text">
          Connecting to room...
        </p>
      </div>
    )
  }

  return (
    <div className="video-meeting-container">
      <LiveKitRoom
        data-lk-theme="default"
        serverUrl={"wss://vcall-297kcgoc.livekit.cloud"}
        token={token}
        connect={true}
        video={video}
        audio={audio}
        className="video-chat-container"
        onDisconnected={onLeave}
      >

        <div className={`video-chat-layout ${showChat || showParticipants ? 'chat-active' : ''}`}>
          <div className="video-main-area">
            <MyVideoConference />
            <RoomAudioRenderer />
          </div>

          <div className={`chat-area ${showChat ? 'visible' : 'hidden'}`}>
            <div className="chat-sidebar-header">
              <h3>Chat</h3>
              <button
                className="close-chat-btn"
                onClick={() => setShowChat(false)}
              >
                <X size={18} />
              </button>
            </div>
            <ChatComponent />
          </div>

          {showParticipants && !showChat && (
            <ParticipantsPanel onClose={() => setShowParticipants(false)} />
          )}

          <div className="meeting-controls-area">
            <ControlBar
              variation='minimal'
              controls={{
                microphone: true,
                camera: true,
                screenShare: true,
                leave: true
              }}
            />
            <button
              className={`control-btn ${showChat ? 'active' : ''}`}
              onClick={() => {
                setShowChat(!showChat);
                if (!showChat) setShowParticipants(false);
              }}
              title="Chat"
            >
              <MessageSquare size={20} />
              <span className="control-btn-label">Chat</span>
            </button>
            <button
              className={`control-btn ${showParticipants ? 'active' : ''}`}
              onClick={() => {
                setShowParticipants(!showParticipants);
                if (!showParticipants) setShowChat(false);
              }}
              title="Participants"
            >
              <Users size={20} />
              <span className="control-btn-label">Participants</span>
            </button>
          </div>
        </div>
      </LiveKitRoom>
    </div>
  )
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} className="video-grid-layout">
      <ParticipantTile />
    </GridLayout>
  );
}

const ChatComponent = () => {
  const { chatMessages, send, isSending } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const room = useRoomContext();
  const localParticipantIdentity = room.localParticipant.identity;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() && !isSending) {
      send(messageText);
      setMessageText('');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="enhanced-chat-container">
      <div className="chat-messages-wrapper">
        {chatMessages.length === 0 ? (
          <div className="no-messages">
            <Info size={40} className="no-messages-icon" />
            <p>No messages yet</p>
            <p className="no-messages-sub">Be the first to send a message</p>
          </div>
        ) : (
          <div className="chat-messages">
            {chatMessages.map((msg, index) => {
              const isLocalParticipant = msg.from?.identity === localParticipantIdentity;

              if (!msg.from) {
                return (
                  <div key={`${msg.timestamp}-${index}`} className="message system">
                    {msg.message}
                  </div>
                );
              }

              return (
                <div
                  key={`${msg.timestamp}-${index}`}
                  className={`message ${isLocalParticipant ? 'self' : ''}`}
                >
                  <div className="message-header">
                    <span className="sender">{msg.from?.identity}</span>
                    <span className="timestamp">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-body">{msg.message}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-container">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="chat-input-field"
          disabled={isSending}
        />
        <button
          type="submit"
          className="chat-send-button"
          disabled={!messageText.trim() || isSending}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default VideoChat;