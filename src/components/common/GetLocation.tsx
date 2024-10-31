import {locationAtom} from '@/atoms/etc';
import {useAtom} from 'jotai';
import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const GetLocation = () => {
    const {pathname} = useLocation();
    const [location, setLocation] = useAtom<string>(locationAtom);
    useEffect(() => {
        setLocation(pathname);
    }, [pathname]);

    return null;
};

export default GetLocation;
