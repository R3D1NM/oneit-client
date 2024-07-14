import { useAtomValue, useSetAtom } from 'jotai'
import { answers, gift, isValidGift, name, recipient } from '@/lib/atoms'
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import React, { Suspense, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Kakao from '@/assets/kakao.png'
import Naver from '@/assets/naver_blog.png'
import Instagram from '@/assets/instagram.png'
import { Spinner } from '@/components/ui/spinner';
import { getGift } from '@/api/product';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Share from '@/components/common/Share';


const GiftCard = React.lazy(() => import('@/components/Cards/GiftCard'))
const NotFound = React.lazy(() => import('./NotFound'))

const Results = () => {
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate();
    const { chatID } = useParams()

    const getResult = useSetAtom(getGift)
    const product = useAtomValue(gift)
    const isValid = useAtomValue(isValidGift)
    const removeAnswers = useSetAtom(answers)

    const userName = useAtomValue(name)
    const userRecipient = useAtomValue(recipient)


    const handleRetry = () => {
        removeAnswers({} as {[key: string]: string})
        navigate('/recommend');
    }

    useEffect(() => {
        if (!chatID || chatID === "") {
            navigate('/recommend')
        }
        getResult(chatID)

    }, [])
    


    return (
        <>
        <div className="flex flex-col content-center w-full gap-2 justify-center">
        <Card className="flex rounded-lg shadow-md max-w-md w-full flex-col justify-center h-fit py-5">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex justify-between px-4">
                {/* <strong className='font-Bayon text-3xl'>One!t</strong>  */}
                추천 선물
                <Share  url={`https://oneit.gift/result/${chatID}`} title={`ONE!T - ${userName===""?"":userName+"위한 "}선물 추천`} text={product.map(item => item.name).join('\n')}/>
                {/* <Share2Icon/> */}
            </h2>
            <div className='w-full'>
                <Suspense fallback={<Spinner/>}>
                    {isValid?(
                    <Carousel>
                        <CarouselContent>
                            {product.map((item, index) => (
                                <CarouselItem key={index}>
                                    <GiftCard product={item}/>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ): <NotFound/>}
                </Suspense>
            </div>
            {isValid&&<div className='flex flex-col justify-evenly px-2'>
                <Button size="sm" onClick={()=>setShowModal(true)} className="bg-oneit-blue hover:bg-oneit-blue/90 text-black w-full mt-2">
                    더 찾아보기
                </Button>
            </div>}
            
        </Card>
        </div>
        {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>더 많은 선물을 추천 받고 싶다면?</DialogTitle>
                </DialogHeader>
                <div className='flex flex-col'>
                    <p className='m-1 text-lg'><strong className='text-xl font-Bayon'>One!t</strong>의 SNS 채널에서 확인하세요!</p>
                    <div className='flex justify-start'>
                        <a href='https://open.kakao.com/o/g9Pganwg' target='_blank' rel="noreferrer">
                            {/* <Button className='bg-[#FEE500] text-[#191919] hover:bg-[#FEE500] hover:text-[#191919]'> */}
                                <img src={Kakao} alt='kakao-channel' className='h-[35px] mr-1'></img>
                                {/* <p className='m-1'>오픈채팅</p> */}
                            {/* </Button> */}
                        </a>
                        <a href='https://www.instagram.com/oneit.gift' target='_blank' rel="noreferrer">
                            <img src={Instagram} alt='instagram' className='h-[35px] mr-1'></img>
                        </a>
                        <a href='https://blog.naver.com/oneit_gift' target='_blank' rel="noreferrer">
                            <img src={Naver} alt='naver-blog' className='h-[35px]'></img>
                        </a>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                    뒤로가기
                    </Button>
                    <Button type="submit" onClick={() => {setShowModal(false); handleRetry()}}>
                    추천받기
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
        )}
        </>
    )
}

export default Results