import React from "react"

export default function Input({ value, placeholder, onInput, errorMsg }) {
  return (
    <div>
      <input className={`form-control ${errorMsg ? 'is-invalid' : ''}`}
             value={value}
             placeholder={placeholder}
             onInput={onInput}/>
      {errorMsg && <div className="invalid-feedback">{errorMsg}</div>}
    </div>
  )
}