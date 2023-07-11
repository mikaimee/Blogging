import React from 'react'
import {HiOutlineCamera} from 'react-icons/hi'
import {stables} from '../constants'

const ProfilePicture = ({avatar}) => {
    return (
        <div>
            <div>
                <label htmlFor="profilePicture">
                    {avatar ? (
                        <img src={stables.UPLOAD_FOLDER_VASE_URL + avatar} />
                    ) : (
                        <div>
                            <HiOutlineCamera />
                        </div>
                    )}
                </label>
                <input 
                    type="file" 
                    id="profilePicture"
                />
            </div>
            <button>Delete Image</button>
        </div>
    )
}

export default ProfilePicture