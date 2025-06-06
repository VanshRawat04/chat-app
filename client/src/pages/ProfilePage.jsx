import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext)
  const navigate = useNavigate()

  // Use fallback values in case authUser is not immediately available
  const [name, setName] = useState(authUser?.fullName || "")
  const [bio, setBio] = useState(authUser?.bio || "")
  const [selectedImg, setSelectedImg] = useState(null)
  const [preview, setPreview] = useState(null)

  // Keep state in sync if authUser changes (e.g., on refresh or update)
  useEffect(() => {
    setName(authUser?.fullName || "")
    setBio(authUser?.bio || "")
  }, [authUser])

  // Generate and clean up preview URL for uploaded image
  useEffect(() => {
    if (!selectedImg) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(selectedImg)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImg])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedImg) {
      await updateProfile({ fullName: name, bio })
      navigate('/')
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(selectedImg)
    reader.onload = async () => {
      const base64Image = reader.result
      await updateProfile({ profilePic: base64Image, fullName: name, bio })
      navigate('/')
    }
    // If you want to handle errors, you can add reader.onerror logic here
  }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
            <input
              onChange={(e) => setSelectedImg(e.target.files[0])}
              type='file'
              id='avatar'
              accept='.png, .jpg, .jpeg'
              hidden
            />
            <img
              src={preview || assets.avatar_icon}
              alt='Profile Preview'
              className={`w-12 h-12 ${selectedImg ? 'rounded-full' : ''}`}
            />
            Upload Profile Image
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type='text'
            required
            placeholder='Your Name'
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder='Write profile bio'
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'
            rows={4}
          ></textarea>
          <button
            type='submit'
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
          >
            Save
          </button>
        </form>
        <img
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10`}
          src={assets.logo_icon}
          alt='Logo'
        />
      </div>
    </div>
  )
}

export default ProfilePage
