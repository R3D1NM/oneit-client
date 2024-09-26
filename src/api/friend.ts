import axios from '@/lib/axios';

export const fetchFriendList = async () => {
    return axios
        .get('/v2/friends')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const deleteFriend = async (friendIdx: string) => {
    return axios
        .delete(`/v2/friends/${friendIdx}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchFriendRequestsToMe = async () => {
    return axios
        .get('/v2/friends/requests-to-me')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchFriendRequestsFromMe = async () => {
    return axios
        .get('/v2/friends/requests-from-me')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const requestFriend = async (friendIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/request`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const cancelFriendRequest = async (
    friendIdx: string,
    requestIdx: string,
) => {
    return axios
        .delete(`/v2/friends/${friendIdx}/request/${requestIdx}/cancel`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const acceptFriend = async (friendIdx: string, requestIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/request/${requestIdx}/acceptance`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const rejectFriend = async (friendIdx: string, requestIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/request/${requestIdx}/rejection`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
