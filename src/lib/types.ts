export type Answer = {
    question: string;
    answer: string;
};

export type Keyword = {
    idx: number;
    keyword: string;
    description: string;
};

export type Product = {
    idx: number;
    name: string;
    originalPrice: number;
    currentPrice: number;
    discountRate: number;
    brandName: string;
    mallName: string;
    productUrl: string;
    thumbnailUrl: string;
    categoryName: string;
    categoryDisplayName: string;
    keywords: string[];
    status: string;
    description: string;
    likeCount?: number;
    voteStatus?: 'LIKE' | 'DISLIKE' | 'NONE';
};

export type Question = {
    question: string;
    options: string[];
    tags: string[];
};

export type User = {
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    status: string;
    idx: number;
    name: string;
    nickname: string;
    email: string;
    phoneNumber: string;
    nicknameFromKakao: string;
    profileImgFromKakao: string;
    gender: 'FEMALE' | 'MALE';
    age: string;
    birthDate: Date;
    refreshToken: string;
};

export type Basket = {
    idx: number;
    name: string;
    description: string;
    deadline: Date;
    createdUserIdx?: number;
    accessStatus: string;
    imageUrl?: string;
    participants?: Participant[];
};

export interface Participant {
    userIdx?: number;
    nickname: string;
    profileImage: string;
    userRole?: 'MANAGER' | 'PARTICIPANT';
}

export type Collection = {
    idx: number;
    name: string;
    description?: string;
    thumbnailUrl: string;
};
