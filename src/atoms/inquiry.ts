import {InquiryChoice} from '@/lib/types';
import {atom} from 'jotai';

export const choices = atom<InquiryChoice[]>([]);
choices.debugLabel = 'Inquiry Choices';
export const addChoice = atom(null, (get, set, choice: InquiryChoice) => {
    //if prouctIdx already exists, replace it
    const idx = get(choices).findIndex(
        (c) => c.productIdx === choice.productIdx,
    );
    if (idx !== -1) {
        set(choices, (prev) => {
            prev[idx] = choice;
            return [...prev];
        });
    } else {
        set(choices, [...get(choices), choice]);
    }
});
