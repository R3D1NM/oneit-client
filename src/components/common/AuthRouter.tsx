import { authAtom } from '@/api/auth';
import { useAtomValue } from 'jotai';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthProps {
    children: React.ReactNode;
    option: boolean | null;
    redirectTo: string;
    //null   Anyone Can go inside
    //true   only logged in user can go inside
    //false  logged in user can't go inside
}


export default ({children, option, redirectTo}: AuthProps) => {
    const user = useAtomValue(authAtom);
    // console.log(user,option,redirectTo);

    if(user === null){
        // console.log("Not logged in user");
        
        if(option === true){
            return <Navigate to={redirectTo} replace/>
        }
    }else if(user ! == null){ // logged in user
        // console.log("logged in user");
        
        if(option === false){
            return <Navigate to={redirectTo} replace/>
        }
    }

    return (
        <>
        {children}
        </>        
    )
}