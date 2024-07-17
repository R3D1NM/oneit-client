import LottieContainer from "@/components/common/LottieContainer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const About = () => {
  return (
    <div className='flex flex-col content-center mt-0 w-full items-center'>
        <div className='flex w-full rounded-lg bg-oneit-pink px-3 py-1 my-2 '>
            <h1 className='text-2xl'>WANNA GIFT IT, ONE!T</h1>
        </div>
        <Card className='py-2 px-0 mb-2 flex flex-col w-full'>
            <CardHeader className="py-0 px-3 mb-2">
                <h1 className='text-xl'>모든 선물은 특별해야하니까</h1>
            </CardHeader>
            <CardDescription className='px-3 pb-2'>
                선물 고르기 어렵다면 <br/>
                혼자서 고민하다 미루지 말고 <br/>
                ONE!T에서 같이 고민하자!
                {/* 고른다 선물 여기서! <br/>
                선물 고르기에 지친 우리들을 위해 <br/>
                이제는 혼자서 고민하지 말고 <br/>
                이거 줄까 말까 우물쭈물하지 말고 <br/>
                ONE!T */}

            </CardDescription>
            {/* <CardContent className='pb-3 px-3 flex justify-center'>
                <p className="font-thin">
                    ONE!T(워닛)은 선물 고르기에 지친 우리들을 위한 서비스입니다.
                    다채로운 선물 제품의 홍수 속에서 어떤 선물을 해주어야할지 고민되는 요즘, 
                    소중한 사람을 위한 맞춤 선물을 함께 골라보아요!
                </p>
            </CardContent> */}
        </Card>
        <Card className="w-full bg-gradient-to-br mb-2 from-[#ffa0a0] to-[#ff9595] hover:from-[#FF9595] hover:to-[#FF9090] transition-colors duration-300 rounded-lg h-[20%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="/recommend" className="w-full h-full flex flex-col justify-between">
            <CardHeader className='p-3'>
                <CardTitle className="text-xl">선물 뭐 주지?</CardTitle>
                <CardDescription className='text-oneit-gray'>어떤 선물을 줘야 좋아할까? 선물 취향 테스트</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <ArrowRight className="text-oneit-gray"/>
            </CardFooter>
            </Link>
        </Card>
        <Card className="w-full bg-gradient-to-br from-oneit-blue to-[#a3dbff] hover:from-[#a3dbff] hover:to-[#98d5fb] transition-colors duration-300 rounded-lg h-[20%] flex flex-col justify-between shadow-md border-0 max-w-md">
            <Link to="/basket" className="w-full h-full flex flex-col justify-between">
            <CardHeader className='p-3'>
                <CardTitle className="text-xl">이 중에 뭐 주지?</CardTitle>
                <CardDescription className='text-oneit-gray'>뭘 좋아할지 몰라서 다 준비해봤어</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <ArrowRight className="text-oneit-gray"/>
            </CardFooter>
            </Link>
        </Card>
        {/* <LottieContainer fileName='giftpop_animate.json' className='mb-[-20%] w-[50%] mt-2 pt-2'/> */}
    </div>
  )
}

export default About