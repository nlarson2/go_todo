import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../hooks/Windows';

import "./NavBar.css";

export type NavLinkType = {
    navigateTo: string;
    text: string;
}

interface NavBarProps {
    leftLink?: NavLinkType;
    rightLink?: NavLinkType;
    title: string;
    children?: ReactNode;
}

function NavBar(props: NavBarProps) {
    const isMobile = useIsMobile(800)

    if (isMobile) {
        return (
            <div id="navbar">
                < p id='leftLink' >
                    {
                        props.leftLink != null ?
                            <Link to={props.leftLink.navigateTo}>{props.leftLink.text}</Link>
                            : <></>
                    }
                </p >

                <p id='title'>{props.title}</p>
                <p id='rightLink'>
                    {props.rightLink != null ?
                        <Link to={props.rightLink.navigateTo}>{props.rightLink.text}</Link>
                        : <></>
                    }
                </p>
            </div >
        )
    }
    return (
        <>
        </>
    )
}

export default NavBar;