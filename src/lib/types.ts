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

//todo: match with server
export type User = {
    user_id: number;
    name: string;
    email: string;
}