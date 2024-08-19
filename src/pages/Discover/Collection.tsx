import React from 'react';
import {useParams} from 'react-router-dom';

const Collection = () => {
    const {collectionID} = useParams();
    return <div>Collection</div>;
};

export default Collection;
