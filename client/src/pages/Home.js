"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  VideoIcon,
  MicIcon,
  MicOffIcon,
  VideoOffIcon,
  PhoneIcon,
  ChatIcon,
  ScreenShareIcon,
  PeopleIcon,
} from "../components/Icons"
import "../styles/Home.css"

const Home = () => {
  const { currentUser, logout } = useAuth()
  const [isInCall, setIsInCall] = useState(false)
  const [roomId, setRoomId] = useState("")
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [participants, setParticipants] = useState([])

  const handleStartCall = () => {
    if (!roomId) {
      const newRoomId = Math.random().toString(36).substring(2, 7)
      setRoomId(newRoomId)
    }
    setIsInCall(true)

    setParticipants([{ id: "demo-user", name: "Demo User" }])
  }

  const handleEndCall = () => {
    setIsInCall(false)
    setParticipants([])
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo">
          <VideoIcon />
          <h1>Vcall</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {currentUser?.name || "User"}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        {!isInCall ? (
          <div className="start-call-container">
            <h2>Start or join a meeting</h2>
            <div className="room-input">
              <input
                type="text"
                placeholder="Enter room ID or leave empty to create new"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button onClick={handleStartCall} className="start-call-button">
                Start Meeting
              </button>
            </div>
          </div>
        ) : (
          <div className="call-container">
            <div className="call-info">
              <span>Room: {roomId}</span>
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(roomId)
                  alert("Room ID copied to clipboard!")
                }}
              >
                Copy ID
              </button>
            </div>

            <div className="video-grid">
              {/* Main video - self view */}
              <div className="video-container main-video">
                {isVideoOn ? (
                  <div className="video-placeholder">
                    <span>Your camera is on</span>
                    <p>In a real app, this would show your camera feed</p>
                  </div>
                ) : (
                  <div className="video-off">
                    <div className="avatar">{currentUser?.name?.charAt(0) || "U"}</div>
                  </div>
                )}
                <div className="video-name">You</div>
              </div>

              {/* Participant videos */}
              {participants.map((participant) => (
                <div key={participant.id} className="video-container">
                  <div className="video-placeholder">
                    <div className="avatar">{participant.name.charAt(0)}</div>
                  </div>
                  <div className="video-name">{participant.name}</div>
                </div>
              ))}
            </div>

            <div className="call-controls">
              <button className={`control-button ${!isMicOn ? "off" : ""}`} onClick={() => setIsMicOn(!isMicOn)}>
                {isMicOn ? <MicIcon /> : <MicOffIcon />}
              </button>

              <button className={`control-button ${!isVideoOn ? "off" : ""}`} onClick={() => setIsVideoOn(!isVideoOn)}>
                {isVideoOn ? <VideoIcon /> : <VideoOffIcon />}
              </button>

              <button
                className={`control-button ${isScreenSharing ? "active" : ""}`}
                onClick={() => setIsScreenSharing(!isScreenSharing)}
              >
                <ScreenShareIcon />
              </button>

              <button className="control-button" onClick={() => setIsChatOpen(!isChatOpen)}>
                <ChatIcon />
              </button>

              <button
                className="control-button"
                onClick={() => alert("Participants: " + participants.map((p) => p.name).join(", "))}
              >
                <PeopleIcon />
                <span className="badge">{participants.length + 1}</span>
              </button>

              <button className="control-button end-call" onClick={handleEndCall}>
                <PhoneIcon />
              </button>
            </div>

            {isChatOpen && (
              <div className="chat-panel">
                <div className="chat-header">
                  <h3>Chat</h3>
                  <button onClick={() => setIsChatOpen(false)}>×</button>
                </div>
                <div className="chat-messages">
                  <div className="chat-message">
                    <div className="message-sender">System</div>
                    <div className="message-content">Welcome to the meeting!</div>
                    <div className="message-time">Just now</div>
                  </div>
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Type a message..." />
                  <button>Send</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
