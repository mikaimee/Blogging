import React, { useState } from 'react'
import PropTypes from 'prop-types'

// Provides a form for adding new comments

/* Prop list: 'btnLabel' (label for the submit button), 'formSubmitHandler' (function to handle form submission), 'formCancelHandler' (optional function to handle canceling form submission),
 'initialText' (optional initial text for text area), and 'loading' (boolean indication whether the form is in loading state) */
const AddComment = ({btnLabel, formSubmitHandler, formCancelHandler = () => {}, initialText="", loading=false}) => {

    const [value, setValue] = useState(initialText)

    const submitHandler = (e) => {
        e.preventDefault()
        formSubmitHandler(value)
        setValue("")
    }

    const handleCancel = () => {
        if (formCancelHandler) {
            formCancelHandler()
        }
        setValue("")
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="flex flex-col items-end border border-primary rounded-lg p-4">
                <textarea
                    className="w-full focus:outline-none bg-transparent"
                    rows="5"
                    placeholder='Leave comment here'
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex flex-col-reverse gap-y-2 items-center gap-x-2 pt-2 min-[420px]:flex-row">
                    {formCancelHandler && (
                        <button 
                            className="px-6 py-2.5 rounded-lg border border-red-500 text-red-500"
                            type='button'
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        className="px-6 py-2.5 rounded-lg bg-primary text white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                        type='submit'
                        disabled={loading}
                    >
                        {btnLabel}
                    </button>
                </div>
            </div>
        </form>
    )
}

// Help ensure that props passed to a component have the expected types and helps catch errors during development
AddComment.propTypes = {
    btnLabel: PropTypes.string.isRequired,
    formSubmitHandler: PropTypes.func.isRequired,
    formCancelHandler: PropTypes.func.isRequired,
    initialText: PropTypes.string,
    loading: PropTypes.bool

}

export default AddComment