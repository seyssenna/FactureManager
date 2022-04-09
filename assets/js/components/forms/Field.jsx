import React from 'react';

const Field = ({ name, label, value, onChange, placeholder = "", type = "text", error = "" }) => {
    return ( 
        <div className="form-group mb-3">
                    <label htmlFor={name}>{label}</label>
                    <input 
                        value={value} 
                        onChange={onChange}
                        type={type}
                        name={name}
                        className={"form-control" + (error && " is-invalid")}
                        placeholder={placeholder || label} 
                        id={name} 
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
     );
}
 
export default Field;