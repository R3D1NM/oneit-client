import {atom} from 'jotai';
import {Answer, Product} from '../lib/types';
import questionList from '@/data/question.json';

//Quiz
export const question = atom(questionList);
question.debugLabel = 'question';
export const answers = atom({} as {[key: string]: string});
answers.debugLabel = 'answers';

//Recommend
export const name = atom('');
name.debugLabel = 'name';
export const recipient = atom('친구');
recipient.debugLabel = 'recipient';
export const occasion = atom('생일');
occasion.debugLabel = 'occasion';
export const priceRange = atom([30000, 100000]);
priceRange.debugLabel = 'priceRange';
export const gender = atom<'MALE' | 'FEMALE'>('FEMALE');
gender.debugLabel = 'gender';

export const loading = atom(false);
loading.debugLabel = 'loading';

//Result
export const gift = atom([] as Product[]);
gift.debugLabel = 'gift';
export const isValidGift = atom(false);
isValidGift.debugLabel = 'isValidGift';
export const title = atom('네가 주면 난 다 좋아! 🎁');
title.debugLabel = 'title';
export const comment = atom('#까다롭지_않아요 #취향_안_타요');
comment.debugLabel = 'comment';
