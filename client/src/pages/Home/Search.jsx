import React from 'react'

const Search = () => {
    return (
        <div>
            <div>
                <form>
                    <div className='relative'>
                        <input
                            type='text'
                            id='from-subscribe-Filter'
                            className='rounded-lg border-transparent flex-1 appearance-none border-gray-300 w-full py-2 ox-4 text-gray-700 placeholder-gray-400'
                            placeholder='Search here...'
                            // value={searchKeyword}
                        />
                        <button
                            className='flex-shrink-0 px-4 py-2 text-base font-semibokd'
                            type='submit'
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Search