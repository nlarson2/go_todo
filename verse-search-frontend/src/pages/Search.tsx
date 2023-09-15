import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/Windows';

import NavBar from '../components/NavBar';

interface SearchProps {

}

function Search(props: SearchProps) {
    const isMobile = useIsMobile(800);
    return (
        <>
            <div className='page'>
                {isMobile ?
                    <NavBar title='Search' leftLink={{ text: "< Home", navigateTo: "/" }} />
                    : <></>
                }
                Search Page
            </div>
        </>
    )
}


export default Search