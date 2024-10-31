import React, {createContext, useContext} from 'react';
import {useLocation, Location} from 'react-router-dom';

const LocationContext = createContext<Location | null>(null);

export const LocationProvider = ({children}: {children: React.ReactNode}) => {
    const location = useLocation();
    return (
        <LocationContext.Provider value={location}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error(
            'useLocationContext must be used within a LocationProvider',
        );
    }
    return context;
};
