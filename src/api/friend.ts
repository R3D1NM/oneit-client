import axios from '@/lib/axios';
import {Friend, FriendRequest, Product} from '@/lib/types';

export const fetchFriendList = async (): Promise<Friend[]> => {
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

export const fetchFriendRequestsToMe = async (): Promise<FriendRequest[]> => {
    return axios
        .get('/v2/friends/requests-to-me')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fetchFriendRequestsFromMe = async (): Promise<FriendRequest[]> => {
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

export const fetchUserInfo = (userID: string): Promise<Friend> => {
    return axios
        .get(`/v2/friends/${userID}`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const fectchBirthdayList = async (): Promise<Friend[]> => {
    return axios
        .get('/v2/friends/birthday')
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const timeAttackToggle = async (friendIdx: string) => {
    return axios
        .post(`/v2/friends/${friendIdx}/time-attack/toggle`)
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};

export const timeAttackWishRamdom = async (
    friendIdx: string,
    excludeIdx?: number,
): Promise<Product> => {
    return axios
        .get(
            `/v2/friends/${friendIdx}/wish-list/random` +
                (excludeIdx ? `?excludeProductIdx=${excludeIdx}` : ''),
        )
        .then((res) => {
            return Promise.resolve(res.data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
};
