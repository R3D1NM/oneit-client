export type Answer = {
    question: string;
    answer: string;
};

export type Keyword = {
    idx: number;
    name: string;
    description: string;
    field?: string;
};

export type Product = {
    idx: number;
    name: string;
    originalPrice: number;
    brandName?: string;
    mallName?: string;
    productUrl?: string;
    thumbnailUrl: string;
    categoryName?: string;
    categoryDisplayName?: string;
    keywords?: Keyword[];
    productStatus?: string;
    detailImages?: string[];
    description: string;
    likeCount?: number;
    voteStatus?: 'LIKE' | 'DISLIKE' | 'NONE';
};

export type BaksetProduct = {
    idx: number;
    name: string;
    originalPrice: number;
    thumbnailUrl: string;
    keywords: Keyword[];
    productStatus: string;
    description: string;
    likeCountInGiftbox: number;
    voteStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    purchaseStatus: 'PURCHASED' | 'NOT_PURCHASED';
    emojiIdx?: 'LOVE' | 'LIKE' | 'NEED' | 'SOSO' | 'BAD' | 'HAVE';
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
    description?: string;
    deadline: Date | string;
    createdUserIdx?: number;
    accessStatus?: string;
    imageUrl?: string;
    participants?: Participant[];
    dday: number;
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

export type Emoji = {
    idx: number;
    name: string;
    content: string;
};

export type InquiryChoice = {
    productIdx: number;
    emojiName: 'LOVE' | 'LIKE' | 'NEED' | 'SOSO' | 'BAD' | 'HAVE';
};

export type Friend = {
    idx: number;
    name: string;
    nickName: string;
    profileImg: string;
    birthDate: Date;
};

export type SignUpUser = {
    name: string;
    nickname: string;
    gender: 'FEMALE' | 'MALE';
    birthDate: string;
};

export type Notif = {
    idx: number;
    title: string;
    body: string;
    receiverIdx: number;
    createdAt: Date;
    notiStatus: 'CREATED' | 'SENT' | 'READ';
    actionType: string;
};

export type Comment = {
    idx: number;
    giftboxProductIdx: number;
    writerIdx: number;
    writerNickName: string;
    writerProfileImg: string;
    content: string;
    createdAt: Date;
};
