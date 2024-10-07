import {firebaseMessagingConfig} from '@/lib/firebase';
import {atomWithDefault} from 'jotai/utils';

export const FCMToken = atomWithDefault(firebaseMessagingConfig);
