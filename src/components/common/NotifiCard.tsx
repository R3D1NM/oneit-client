import {Notif} from '@/lib/types';
import React, {useState} from 'react';
import {DropdownMenuItem} from '../ui/dropdown-menu';
import {useMutation} from '@tanstack/react-query';
import {readNotification} from '@/api/notification';
import {useNavigate} from 'react-router-dom';
import {cn} from '@/lib/utils';

const NotifiCard = (props: {notif: Notif}) => {
    const {notif} = props;
    const navigate = useNavigate();
    const [isRead, setIsRead] = useState(notif.notiStatus === 'READ');
    const readAPI = useMutation({
        mutationKey: ['readNotif'],
        mutationFn: () => readNotification(notif.idx),
    });

    const relatedPage: {[key: string]: string} = {
        SIGNUP_COMPLETE: '/mypage',
        FRIEND_REQUEST: '/friends',
        FRIEND_ACCEPTANCE: '/friends',
        // "GIFTBOX_INVITATION": "/basket",
        // "GIFTBOX_ACCEPTANCE": "/basket",
        // "GIFTBOX_ADD_PRODUCT": "/basket",
        // "GIFTBOX_COMMENT": "/basket",
        // "GIFTBOX_LIKE": "/basket",
        // "GIFT_ASK_COMPLETE": "/basket",
        // "BIRTHDAY": "/friends",
        // "TIME_ATTACK_OPEN": "/timeAttack", //todo: sync with App.tsx
    };

    const handleRead = () => {
        if (!isRead) {
            readAPI.mutate();
            setIsRead(true);
        }
        if (relatedPage[notif.actionType]) {
            navigate(relatedPage[notif.actionType]);
        }
    };
    return (
        <DropdownMenuItem
            className="flex flex-col w-full items-start"
            onSelect={(e) => {
                e.preventDefault();
                handleRead();
            }}
        >
            <h3
                className={cn(
                    'text-md font-bold text-start',
                    !isRead && 'text-[#FF4BC1]',
                )}
            >
                {notif.title}
            </h3>
            <p className="text-overflow">{notif.body}</p>
            <span className="text-xs text-[#818181]">
                {notif.createdAt.toString().replace('T', ' ')}
            </span>
        </DropdownMenuItem>
    );
};

export default NotifiCard;
