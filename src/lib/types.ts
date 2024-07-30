export type Answer = {
    question: string;
    answer: string;
}

export type Keyword = {
    idx: number;
    keyword: string;
    description: string;
}

export type Product =     {
    productIdx: number;
    name: string;
    originalPrice: number;
    shoppingmall: string;
    productUrl: string;
    thumbnailUrl: string;
    categoryIdx : number;
    keywords: Keyword[];
    gender: string;
}

export type Question = {
    question: string;
    options: string[];
    tags: string[];
} 


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
    gender: "FEMALE" | "MALE";
    age: string;
    birthDate: Date;
    refreshToken: string
}