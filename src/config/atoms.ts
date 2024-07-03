import { atom } from "jotai";
import { Answer, Product } from "./types";

const MockQuestions = {
    question: "Loading...",
    options: ["One", "Two", "Three"],
}

//Quiz
export const question = atom(MockQuestions);
question.debugLabel = "question";
export const answers = atom({} as {[key: string]: Answer});
answers.debugLabel = "answers";

//Main
export const recipient = atom("친구");
recipient.debugLabel = "recipient";
export const occasion = atom("생일");
occasion.debugLabel = "occasion";
export const priceRange = atom([30000, 100000]);
priceRange.debugLabel = "priceRange";
export const gender = atom("남성");
gender.debugLabel = "gender";

export const loading = atom(false);
loading.debugLabel = "loading";

//Result
export const gift = atom({} as Product);
gift.debugLabel = "gift";
export const isValidGift = atom(false);
isValidGift.debugLabel = "isValidGift";
