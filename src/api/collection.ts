import axios from '@/lib/axios';

export const fetchCollectionList = async () => {
    return axios
        .get('/v1/collections')
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                console.log(res.data.result);

                return Promise.resolve(res.data.result);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
};

export const fetchCollectionDetail = async (collectionID: string) => {
    return axios
        .get(`/v1/collections/${collectionID}`)
        .then((res) => {
            if (res.status === 200 && res.data.isSuccess) {
                console.log(res.data.result);

                return Promise.resolve(res.data.result);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
};
