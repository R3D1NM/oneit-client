import {atom} from 'jotai';

//create basket
export const basketName = atom('');
basketName.debugLabel = 'basketName';
export const basketDescription = atom('');
basketDescription.debugLabel = 'basketDescription';
export const basketDeadline = atom<null | Date>(null);
basketDeadline.debugLabel = 'basketDeadline';
export const thumbnail = atom<null | File>(null);
thumbnail.debugLabel = 'thumbnail';
export const imageUrl = atom('');
