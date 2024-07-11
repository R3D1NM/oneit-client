import { Link, useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAtom, useSetAtom } from 'jotai';
import { gender, occasion, priceRange, recipient } from '@/lib/atoms';
import { Spinner } from '@/components/ui/spinner';
import { startChat } from '@/api/chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LottieContainer from '../common/LottieContainer';

const RecommendCard = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false); // New state for loading

    const [price, setPrice] = useAtom<number[]>(priceRange)
    const [userRecipient, setUserRecipient] = useAtom(recipient)
    const [userOccasion, setUserOccasion] = useAtom(occasion)
    const [userGender, setUserGender] = useAtom(gender)

    const start = useSetAtom(startChat)

    const handleStart = async () => {
        setLoading(true);
        const chatID = nanoid(10);
        try { 
            await start(chatID);
            navigate(`/quiz/${chatID}/1`);
        } catch (error) {
            console.log(error);
            setError(true)
        }finally {
            setLoading(false); // End loading
        }
    }
    
    if(loading) return <Spinner/>


    return(
        <>
        <Card className="w-full bg-gradient-to-br from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[60%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="#" className="w-full h-full flex flex-col justify-between" onClick={()=>setShowModal(true)}>
            <CardHeader className='p-3'>
                <CardTitle>선물 추천</CardTitle>
                <CardDescription className='text-oneit-gray'>질문에 답하고 선물을 추천 받아 보세요!</CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <LottieContainer path='/src/assets/surpriseGift_animate.json' className='mt-[-80px]'/>
            </CardContent>
            </Link>
        </Card> 
        {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>시작하기</DialogTitle>
                <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-2 justify-around">
                    <Select onValueChange={setUserGender} value={userGender}>
                    <SelectTrigger className="w-[25%]">
                        <SelectValue placeholder={"성별"} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="남성">남성</SelectItem>
                        <SelectItem value="여성">여성</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                    <Select onValueChange={setUserRecipient} value={userRecipient}>
                    <SelectTrigger className="w-[25%]">
                        <SelectValue placeholder="누구" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectItem value="친구">친구</SelectItem>
                        <SelectItem value="애인">애인</SelectItem>
                        <SelectItem value="부모님">부모님</SelectItem>
                        <SelectItem value="동료">동료</SelectItem>
                        <SelectItem value="지인">지인</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                    <p className="text-gray-500 dark:text-gray-400">의</p>
                    <Select onValueChange={setUserOccasion} value={userOccasion}>
                    <SelectTrigger className="w-[25%]">
                        <SelectValue placeholder="어떤" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup >
                        <SelectItem value="생일">생일</SelectItem>
                        <SelectItem value="기념일">기념일</SelectItem>
                        <SelectItem value="졸업">졸업</SelectItem>
                        <SelectItem value="응원">응원</SelectItem>
                        <SelectItem value="기타">기타</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                    <p className="text-gray-500 dark:text-gray-400">선물</p>
                </div>
                <div className="space-y-2 w-full my-2">
                    <Slider
                    id="gift-price"
                    min={0}
                    max={300000}
                    step={10000}
                    value={price}
                    onValueChange={setPrice}
                    className="w-full"
                    />
                    <div className='flex justify-end align-middle'>
                        <div className="flex justify-around text-sm text-gray-500 dark:text-gray-400">
                            <Input value={price[0].toLocaleString()} onChange={(e)=>{
                                const value = Number(e.target.value.replace(/,/g, ''))
                                if (!isNaN(value)) setPrice([value<=500000?value:500000,price[1]])
                                }} className='w-[30%]'/>
                            <p className="text-gray-500 dark:text-gray-400 content-center">원부터</p>  
                            <Input value={price[1].toLocaleString()} onChange={(e)=>{
                                const value = Number(e.target.value.replace(/,/g, ''))
                                if (!isNaN(value)) setPrice([price[0],value<=500000?value:500000])
                                }} className='w-[30%]'/>
                            <p className="text-gray-500 dark:text-gray-400 content-center">원까지</p>  
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowModal(false)}>
                    뒤로가기
                    </Button>
                    <Button type="submit" onClick={() => {setShowModal(false); handleStart()}}>
                    추천받기
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
        )}
        {error && (
            <Dialog open={error} onOpenChange={setError}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>문제 발생</DialogTitle>
                </DialogHeader>
                <DialogDescription>문제가 발생했습니다. 다시 시도해주세요.</DialogDescription>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {setError(false); navigate('/'); } }>
                    메인으로
                    </Button>
                    <Button type="submit" onClick={() => {setError(false); handleStart();} }>
                    다시시도
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
        )}
        </>
    )
}

export default RecommendCard