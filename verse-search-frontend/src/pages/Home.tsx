import React from 'react';
import ReactDOM from 'react-router-dom';
import { useIsMobile } from '../hooks/Windows';

import NavBar from '../components/NavBar';

interface HomeProps {

}

function Home(props: HomeProps) {
    const isMobile = useIsMobile(800);
    return (
        <>
            <div className='page'>
                {isMobile ?
                    <NavBar title="Home" rightLink={{ text: "Search >", navigateTo: "/search" }} />
                    : <></>
                }
                Home page
            </div>
        </>
    )
}

export default Home