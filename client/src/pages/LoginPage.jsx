import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const [agree, setAgree] = useState(false)

  const { login } = useContext(AuthContext)

  // Unified form submission handler
  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (!agree) {
      alert("You must agree to the terms to proceed.")
      return
    }
    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }
    // Prepare payload based on state
    let payload
    if (currState === 'Sign Up') {
      payload = { fullName, email, password, bio }
    } else {
      payload = { email, password }
    }
    // Call login function with appropriate state
    login(currState === 'Sign Up' ? 'signup' : 'login', payload)
    // Optionally reset state here
    // alert("Form submitted!") // Consider using toast instead in production
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly 
      max-sm:flex-col backdrop-blur-2xl'>

      {/*----left: Logo----*/}
      <img src={assets.logo_big} alt='Logo' className='w-[min(30vw, 250px)]' />

      {/*----right: Form----*/}
      <form
        className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'
        onSubmit={onSubmitHandler}
      >
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {/* Show back arrow only during bio step of Sign Up */}
          {isDataSubmitted && currState === "Sign Up" && (
            <img
              src={assets.arrow_icon}
              alt='Back'
              className='w-5 cursor-pointer'
              onClick={() => setIsDataSubmitted(false)}
              title="Back"
            />
          )}
        </h2>

        {/* Full Name field only for Sign Up, first step */}
        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type='text'
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Full Name'
            required
          />
        )}

        {/* Email & Password fields for both Login and Sign Up (first step) */}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type='email'
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type='password'
              placeholder='Password'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </>
        )}

        {/* Bio field only for Sign Up, second step */}
        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a short bio...'
            required
          ></textarea>
        )}

        <button
          type='submit'
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'
        >
          {currState === "Sign Up"
            ? isDataSubmitted
              ? "Finish Sign Up"
              : "Create Account"
            : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input
            type='checkbox'
            checked={agree}
            onChange={() => setAgree(!agree)}
            id='agree'
            className='accent-violet-600'
          />
          <label htmlFor='agree'>
            Agree to the terms of use & privacy policy.
          </label>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" ? (
            <p className='text-sm text-gray-600'>
              Already have an account?{" "}
              <span 
                onClick={() => {setCurrState("Login"); setIsDataSubmitted(false)}} 
                className='font-medium text-violet-500 cursor-pointer'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-600'>
              Create an account{" "}
              <span
                onClick={() => {setCurrState("Sign Up"); setIsDataSubmitted(false)}}
                className='font-medium text-violet-500 cursor-pointer'
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
