import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUser } = useContext(AuthContext) // Make sure this matches your AuthContext

  const scrollEnd = useRef(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
    // eslint-disable-next-line
  }, [selectedUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === '') return
    await sendMessage({ text: input.trim() })
    setInput('')
  }

  // Handle sending an image
  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Select an image file')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  return selectedUser ? (
    <div className="h-full relative backdrop-blur-lg flex flex-col">
      {/*----header-----*/}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || assets.avatar_icon} alt={selectedUser.fullName} className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          <span className={`w-2 h-2 rounded-full ${Array.isArray(onlineUser) && onlineUser.includes(selectedUser._id) ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="Help" className="max-md:hidden max-w-5" />
      </div>

      {/*----chat area-----*/}
      <div
        className="flex-1 flex flex-col overflow-y-auto p-3 pb-6"
        style={{ scrollbarWidth: 'auto' }} // Firefox scrollbar style (optional)
      >
        {messages.map((msg, index) => (
          <div
            key={msg._id || index}
            className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id ? 'flex-row-reverse' : ''}`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="Sent media"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all
                   bg-violet-500/30 text-white 
                  ${
                    msg.senderId === authUser._id
                      ? 'rounded-br-none'
                      : 'rounded-bl-none'
                  }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser?.profilePic || assets.avatar_icon
                    : selectedUser?.profilePic || assets.avatar_icon
                }
                alt="Sender avatar"
                className="w-7 rounded-full"
              />
              <p className="text-white">{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/*----bottom area-----*/}
      <form className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-transparent" onSubmit={handleSendMessage}>
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' ? handleSendMessage(e) : null}
          />
          <input onChange={handleSendImage} type="file" id="image" accept="image/png, image/jpeg" hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="Send media" className="w-5 mr-2 cursor-pointer" />
          </label>
        </div>
        <img
          src={assets.send_button}
          alt="Send"
          className="w-7 cursor-pointer"
          onClick={handleSendMessage}
        />
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full">
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
