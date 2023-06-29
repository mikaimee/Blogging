import React, { useState } from 'react'

const AddComment = ({initialText=""}) => {

    return (
        <div>
            <form>
                <textarea
                    rows="5"
                    placeholder='Leave comment here'
                    // value=
                    // onChange={}
                />
            </form>
        </div>
    )
}

export default AddComment