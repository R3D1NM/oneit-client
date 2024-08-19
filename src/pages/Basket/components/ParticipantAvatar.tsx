import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {Participant} from '@/lib/types';
import {cn} from '@/lib/utils';
import {UserCircle2} from 'lucide-react';
import React from 'react';

const ParticipantAvatar = (props: Participant) => {
    return (
        <TooltipProvider>
            <div>
                <a>
                    <Tooltip>
                        <TooltipTrigger>
                            <Avatar
                                className={cn(
                                    props.userRole == 'MANAGER' &&
                                        'border-2 border-oneit-pink',
                                )}
                            >
                                <AvatarImage src={props.profileImage} />
                                <AvatarFallback>
                                    <UserCircle2 />
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{props.nickname}</TooltipContent>
                    </Tooltip>
                </a>
            </div>
        </TooltipProvider>
    );
};

export default ParticipantAvatar;
