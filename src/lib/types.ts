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
    productStatus: 'PENDING' | 'ACTIVE' | 'INVALID' | 'UNSUPPORTED' | 'DELETED';
    detailImages?: string[];
    description: string;
    likeCount: number;
    likeStatus: 'LIKE' | 'DISLIKE' | 'NONE';
};

export type Category = {
    idx: number;
    name: string;
    level: number;
    displayName: string;
    parent: string;
    parentCategoryName: string;
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

export type BaskestProductDetail = {
    idx: number;
    name: string;
    description: string;
    originalPrice: number;
    thumbnailUrl: string;
    productStatus: 'PENDING' | 'ACTIVE' | 'INVALID' | 'UNSUPPORTED' | 'DELETED';
    keywords: Keyword[];
    likeCount: number;
    likeStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    brandName: string;
    mallName: string;
    productUrl: string;
    categoryName: string;
    categoryDisplayName: string;
    category: Category;
    detailImages: string[];
    likeCountInGiftbox: number;
    voteStatus: 'LIKE' | 'DISLIKE' | 'NONE';
    purchaseStatus: 'PURCHASED' | 'NOT_PURCHASED';
    emojiIdx: 'LOVE' | 'LIKE' | 'NEED' | 'SOSO' | 'BAD' | 'HAVE';
};

export type CollctionProduct = {
    productIdx: number;
    productName: string;
    keywords: Keyword[];
    showcaseImageUrl: string;
};

export type Question = {
    question: string;
    options: string[];
    tags: string[];
};

export type User = {
    idx: number;
    name: string;
    nickname: string;
    email: string;
    phoneNumber: string;
    gender: 'FEMALE' | 'MALE';
    birthDate: Date;
    profileImg: string;
};

export type Basket = {
    idx: number;
    name: string;
    description?: string;
    deadline: string;
    createdUserIdx?: number;
    accessStatus?: string;
    imageUrl?: string;
    participants?: Participant[];
    dday: number;
    createdAt: Date;
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

export type CollectionProduct = {
    productIdx: number;
    productName: string;
    keywords: Keyword[];
    showcaseImageUrl: string;
    productStatus: 'PENDING' | 'ACTIVE' | 'INVALID' | 'UNSUPPORTED' | 'DELETED';
};

export type CollectionDetail = {
    collectionIdx: number;
    collectionName: string;
    collectionDescription: string;
    collectionThumbnailUrl: string;
    collectionProductDTOList: CollectionProduct[];
};

export type Emoji = {
    idx: number;
    name: string;
    content: string;
};

export type Inquiry = {
    idx: 0;
    giftboxIdx: 0;
    target: string;
    selectedProducts: Product[];
};

export type InquiryChoice = {
    productIdx: number;
    emojiName: 'LOVE' | 'LIKE' | 'NEED' | 'SOSO' | 'BAD' | 'HAVE';
};

export type OtherUser = {
    idx: number;
    nickName: string;
    profileImg: string;
    birthDate: string;
    isFriend: boolean;
};

export type Friend = {
    idx: number;
    name: string;
    nickName: string;
    profileImg: string;
    birthDate: Date;
};

export type FriendRequest = {
    requestIdx: number;
    fromUser: Friend;
    requestDate: Date;
};

export type SignUpUser = {
    name: string;
    nickname: string;
    gender: 'FEMALE' | 'MALE';
    birthDate: string;
    isAgreeMarketing: boolean;
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

export type RecommendRecord = {
    chatID: string;
    name: string;
    gender: 'MALE' | 'FEMALE';
    recipient: string;
    occasion: string;
    priceRange: number[];
    createdAt: number;
    production: string;
    userID: string;
    answers: string[];
    modifiedAt: number;
    result: Product[];
    resultType: {
        comment: string;
        title: string;
    };
};
