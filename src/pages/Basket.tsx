import LottieContainer from '@/components/common/LottieContainer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Basket = () => {
    return (
        <div className='flex flex-col content-center mt-3 w-fit justify-center gap-2'>
            <div className='flex flex-col gap-2'>
                <h1 className='text-2xl rounded-lg px-3 py-1 w-fit bg-oneit-blue'>이 중에 뭐 주지?</h1>
                <span className="px-1 text-oneit-gray">
                    선물 고민, 혼자서는 힘드니까 같이 고민하고 <br/>
                    받는 사람에게 은근 슬쩍 물어보자 
                </span>
            </div>

            {/* decription of basket */}
            {/* <Card className='py-2 px-0'>
                <CardContent className='pb-0 px-2'>
                    <p className='text-sm'>
                        대충 기능 설명 <br/>
                        선물 고민, 혼자서는 힘드니까 <br/>
                        친구와 같이 고민하고 <br/>
                        받는 사람에게 은근 슬쩍 물어보자 
                    </p>
                </CardContent>
            </Card> */}

            <Card className='relative flex flex-col text-center pb-4'>
                <LottieContainer fileName={"construction_animate.json"} />
                <p className=''>
                    Team CLOV3R가 열심히 개발 중이에요 <br/>
                    
                    <a className='inline-block' href='http://pf.kakao.com/_kbUxgG/friend'>
                        {/* <Button className=' bg-kakao-yellow hover:bg-kakao-yellow/90 px-2 mx-1' size="sm" variant="ghost"> */}
                        <Button className=' bg-kakao-yellow hover:bg-kakao-yellow/90 px-2 mx-1' size="sm" variant="ghost">
                        {/* <strong className='font-Bayon mr-1'>ONE!T</strong>  */}
                        ONE!T 카카오톡 공식 채널
                        </Button>
                    </a>
                    을 추가하면 <br/>
                    공식 오픈시 알림을 드려요!
                </p>
                {/* <img src='https://via.placeholder.com/400' className='w-full' /> */}
            </Card>
        </div>
    )
}

export default Basket