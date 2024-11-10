import axios from '@/lib/axios';
import {Collection, CollectionDetail} from '@/lib/types';

export const fetchCollectionList = async (): Promise<Collection[]> => {
    return axios
        .get('/v2/collections')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            // console.error(err);
            return Promise.reject(err);
        });
};

export const fetchCollectionDetail = async (
    collectionID: string,
): Promise<CollectionDetail> => {
    return axios
        .get(`/v2/collections/${collectionID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            // console.error(err);
            return Promise.reject(err);
        });
};
