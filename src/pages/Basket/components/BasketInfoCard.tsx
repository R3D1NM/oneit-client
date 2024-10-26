import {Basket, Participant} from '@/lib/types';
import React from 'react';

import Logo from '@/assets/images/oneit.png';
import {useNavigate} from 'react-router-dom';

const BasketInfoCard = ({
    basket,
}: {basket: Basket} & React.HTMLAttributes<HTMLSpanElement>) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/basket/${basket.idx}`);
    };

    //calculate the d-day
    const today = new Date();
    const dday = new Date(basket.deadline);
    const gap = dday.getTime() - today.getTime();
    const dDay = Math.ceil(gap / (1000 * 60 * 60 * 24));

    return (
        <ul className="rounding" onClick={handleClick}>
            <li>
                <div className="cont">
                    {dDay >= 0 ? (
                        <div className="capsule">
                            D-
                            {dDay}
                        </div>
                    ) : (
                        <div className="capsule">마감</div>
                    )}
                    <div>
                        <p className="text-sm font-bold">{basket.name}</p>
                        <div className="mt-2 mr-4 text-xs persons">
                            참여자
                            <div className="thums">
                                <ul>
                                    {basket!.participants
                                        ?.slice(0, 3)
                                        ?.map(
                                            (
                                                participant: Participant,
                                                idx: number,
                                            ) => (
                                                <li
                                                    key={`friend-${participant.userIdx}`}
                                                >
                                                    <img
                                                        src={
                                                            participant.profileImage ||
                                                            Logo
                                                        }
                                                    />
                                                </li>
                                            ),
                                        )}
                                    {basket!.participants!.length > 3 && (
                                        <li>
                                            +{basket!.participants!.length - 3}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <img src={basket.imageUrl || Logo} />
            </li>
        </ul>
    );
};

export default BasketInfoCard;
