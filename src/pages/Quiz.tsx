import { useAtomValue, useSetAtom } from 'jotai'
import { loading, name, question, recipient } from '@/lib/atoms'
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { finishChat, next } from '@/api/chat';
import { Question } from "@/lib/types";
import { Card } from '@/components/ui/card';
import {parse} from 'cox-postposition'
import { Progress } from '@/components/ui/progress';

// MAX DEPTH of the chat
const MAXDEPTH = 8;

const Quiz = () => {
    const isloading = useAtomValue(loading)
    const getNextQuestion = useSetAtom(next)
    const endChat = useSetAtom(finishChat)
    const questionList = useAtomValue(question)
    const userRecipient = useAtomValue(recipient)
    const userName = useAtomValue(name)
    
    const navigate = useNavigate();
    const params = useParams()
    const chatID = params.chatID || ""
    const currentDepth = Number(params.currentDepth)

    const [error, setError] = useState(false)
    const [selected, setSelected] = useState(0)

    // Debugging logs
    // console.log('Questions:', questionList[currentDepth], 'Loading:', isloading);

    
    
    const handleAnswerClick = async (index:number) => {
        setSelected(index)
        console.log('Depth:', currentDepth, 'Selected:', index);
        
        if (currentDepth < MAXDEPTH -1) {
            try {
                await getNextQuestion(index, currentDepth)
                navigate(`/quiz/${chatID}/${currentDepth+1}`);
            } catch (error) {
                setError(true)
            }
        }else if (currentDepth === MAXDEPTH -1) {
            try {
                await endChat(chatID, index, currentDepth)
                navigate(`/result/${chatID}`);
            } catch (error) {
                setError(true)
            }
        }else{
            setError(true)
        }
    }

    if (isloading) {
        return <Spinner/>
    }

    return (
        <>
        <div className="flex flex-col content-center w-full gap-2 justify-center">
            <Progress value={currentDepth/MAXDEPTH*100}/>
            <Card className='flex flex-col px-4 py-5'>
                <h2 className="text-xl text-center font-bold mb-4 text-gray-900 dark:text-gray-100">
                    {questionList[currentDepth].question.replace(/000/g, userName===""?userRecipient:userName).split('\n').map((line, index,array) => (
                        <span key={index}>
                            {parse(line)}
                            {index < array.length - 1 && <br />}
                        </span>
                    ))}
                </h2>
                <div className="grid grid-cols-1 gap-4">
                    {questionList[currentDepth].options.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        className=" h-12 py-4 px-4 rounded whitespace-pre-wrap flex flex-col items-center justify-center"
                        size="lg"
                    >
                        {option.split('\n').map((line, index,array) => (
                            <span key={index}>
                            {line}
                            {index < array.length - 1 && <br />}
                            </span>
                        ))}
                    </Button>
                    ))}
                </div>
            </Card>
        </div>
        {error && (
            <Dialog open={error} onOpenChange={setError}>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e: { preventDefault: () => void; }) => {e.preventDefault();}}>
                <DialogHeader>
                    <DialogTitle>문제 발생</DialogTitle>
                </DialogHeader>
                <DialogDescription>문제가 발생했습니다. 다시 시도해주세요.</DialogDescription>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => {setError(false);  navigate('/'); } }>
                    메인으로
                    </Button>
                    <Button type="submit" onClick={() => {setError(false); handleAnswerClick(selected);} }>
                    다시시도
                    </Button>
                </div>
            </DialogContent>
            </Dialog>
            )}
        </>
    )
}

export default Quiz