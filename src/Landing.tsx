import React from 'react';
import {useNavigate} from 'react-router-dom';
import page1 from '@/assets/images/page1.png';
import page2 from '@/assets/images/page2.png';
const Landing = () => {
    const navigate = useNavigate();

    return (
        <section className="h-screen overflow-y-auto scrollbar-hide">
            <div className="pb-20 px-4">
                <div className="w-[11.9375rem] h-[6.5rem] bg-[url('@/assets/images/logo_landing.svg')] bg-no-repeat bg-center bg-contain mx-auto mt-12 mb-[3.25rem]"></div>

                <div className="flex flex-col gap-2.5">
                    <div className="h-[2.5625rem] px-5 text-sm flex justify-center items-center w-fit bg-[#fef1fa] text-[#F01299] to-[#FF4341] rounded-[10px_10px_10px_0px]">
                        아 이번에 선물 뭐하지?
                    </div>
                    <div className="h-[2.5625rem] px-5 text-sm flex justify-center items-center w-fit bg-[#fff0f0] text-[#ff5757] rounded-[10px_10px_0px_10px] ml-auto">
                        얘 이거 이미 가지고 있는 거 아니야?
                    </div>
                    <div className="h-[2.5625rem] px-5 text-sm flex justify-center items-center w-fit bg-[#fef1fa] text-[#F01299] to-[#FF4341] rounded-[10px_10px_10px_0px]">
                        헉 어제 얘 생일이었네?!?! 까먹었다
                    </div>
                    <div className="h-[2.5625rem] px-5 text-sm flex justify-center items-center w-fit bg-[#fff0f0] text-[#ff5757] rounded-[10px_10px_0px_10px] ml-auto">
                        아 선물 준비방 또 생겼어ㅠ
                    </div>
                </div>

                <div className="text-sm text-[#6d6d6d] text-center before:content-[''] before:w-16 before:h-16 before:block before:bg-[url('@/assets/images/exhale.gif')] before:bg-no-repeat before:bg-center before:bg-contain before:mx-auto before:mt-8 before:mb-5">
                    선물하는 과정에서 마주하는 수많은 고민거리로
                    <br />
                    마음을 전달하기 앞서 부담이 쌓인다면
                    {/* <br className="leading-[3px]" />
                    .<br className="leading-[3px]" />.
                    <br className="leading-[3px]" />. */}
                </div>

                <div className="mt-1 text-lg font-bold bg-gradient-to-br from-[#FF4BC1] to-[#FF4341] bg-clip-text text-transparent text-center">
                    지금 바로 ONE!T에서 고민을 해결해보세요!
                </div>

                {/* <div className="text-[0.625rem] text-[#d1d1d1] text-center mt-3.5 after:content-[''] after:w-3 after:h-3 after:block after:bg-[url('@/assets/icon_scroll_down.svg')] after:bg-no-repeat after:bg-center after:bg-contain after:mt-1 after:mx-auto">
                    Scroll Down
                </div> */}

                <div className="mt-5 before:content-[''] before:w-[7.5rem] before:h-[7.5rem] before:block before:bg-[url('@/assets/images/icon_giftbox.svg')] before:bg-no-repeat before:bg-center before:bg-contain before:mx-auto before:mb-2.5">
                    <p className="font-bold bg-gradient-to-br from-[#FF4BC1] to-[#FF4341] bg-clip-text text-transparent text-center text-lg">
                        선물을 원하는 당신을 위한,
                    </p>
                    <p className="font-bold bg-gradient-to-br from-[#FF4BC1] to-[#FF4341] bg-clip-text text-transparent text-center text-2xl">
                        ONE!T 워닛!
                    </p>
                </div>

                <div className="text-sm text-[#454545] text-center mt-5">
                    ONE!T에서 선물을 추천받으며 탐색하고🔍
                    <br />
                    친구들과 함께 선물을 고르고 추억을 쌓으며🎁
                    <br />
                    새로운 선물 문화를 만들어가요💝
                </div>

                <div className="-mx-4 mt-[42px]">
                    <img
                        src={page1}
                        alt="Page 1"
                        className="w-full object-contain"
                    />
                </div>

                <ul className="flex items-center justify-between">
                    <li className="text-[0.9375rem] font-bold bg-gradient-to-br from-[#FF4BC1] to-[#FF4341] bg-clip-text text-transparent text-center after:content-[''] after:w-[4.375rem] after:h-[4.625rem] after:block after:bg-[url('@/assets/images/icon_angel.svg')] after:bg-no-repeat after:bg-center after:bg-contain after:mt-1.5">
                        선물추천
                    </li>
                    <li>
                        <div>
                            간단한 유형검사로 선물을
                            <br />
                            추천 받아보세요
                        </div>
                        <div className="text-xs text-[#6d6d6d] mt-2">
                            받는 대상의 정보를 입력하면 선물 유형과 함께 <br />
                            ONE!T이 선별한 선물 컬렉션에서 개인별 맞춤 <br />
                            선물 리스트를 제공해드려요
                        </div>
                    </li>
                </ul>

                <div className="-mx-4 mt-[42px]">
                    <img
                        src={page2}
                        alt="Page 2"
                        className="w-full object-contain"
                    />
                </div>

                <ul className="flex flex-row-reverse items-center justify-between">
                    <li className="text-[0.9375rem] font-bold bg-gradient-to-br from-[#FF4BC1] to-[#FF4341] bg-clip-text text-transparent text-center after:content-[''] after:w-[4.375rem] after:h-[4.625rem] after:block after:bg-[url('@/assets/images/icon_basket.svg')] after:bg-no-repeat after:bg-center after:bg-contain after:mt-1.5">
                        선물 바구니
                    </li>
                    <li>
                        <div>
                            선물 후보를 한눈에 정리하고
                            <br />
                            친구들과 의견을 공유해보세요
                        </div>
                        <div className="text-xs text-[#6d6d6d] mt-2">
                            여러 사이트에 퍼져있는 선물 후보 제품들을
                            <br />
                            선물 바구니에 모두 담아 보세요 가격비교, 투표,
                            <br />
                            선물 토크로 선물을 결정하는 것을 도와드려요
                        </div>
                    </li>
                </ul>
            </div>

            <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center bg-gradient-to-br from-[#ff4bc1] to-[#ff4341]">
                <button
                    className="w-full text-white text-lg font-bold py-[0.8125rem]"
                    onClick={() => navigate('/main')}
                >
                    시작하기
                </button>
            </div>
        </section>
    );
};

export default Landing;
