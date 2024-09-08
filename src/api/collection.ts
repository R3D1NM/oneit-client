import axios from '@/lib/axios';

export const fetchCollectionList = async () => {
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

export const fetchCollectionDetail = async (collectionID: string) => {
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
