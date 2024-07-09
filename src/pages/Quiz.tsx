import { useAtomValue, useSetAtom } from 'jotai'
import { loading, recipient } from '@/lib/atoms'
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { finishChat, next } from '@/api/chat';
import question from "@/data/question(2).json";
import { Question } from "@/lib/types";

// MAX DEPTH of the chat
const MAXDEPTH = 4

type AnswerOptions = {
    [key: string]: number[];
};

type Questions = {
    [question: string]: AnswerOptions;
};
const questionData: Questions = question;
const questionList: Question[] = Object.keys(questionData).map((question: string, idx: number) => {
    return {
        question,
        options: Object.keys(questionData[question])
    };
})

const Quiz = () => {

    const isloading = useAtomValue(loading)
    const getNextQuestion = useSetAtom(next)
    const endChat = useSetAtom(finishChat)
    const userRecipient = useAtomValue(recipient)
    
    const navigate = useNavigate();
    const params = useParams()
    const chatID = params.chatID
    const currentDepth = Number(params.currentDepth)
    const [error, setError] = useState(false)
    const [selected, setSelected] = useState(0)

    const heads = ["",`${userRecipient}의 `,`${userRecipient}이(가) `, `${userRecipient}의 `, `${userRecipient}와(과) `]

    // Debugging logs
    // console.log('Questions:', questionList[currentDepth], 'Loading:', isloading);

    
    
    const handleAnswerClick = async (index:number) => {
        setSelected(index)
        console.log('Depth:', currentDepth, 'Selected:', index);
        
        if (currentDepth < MAXDEPTH) {
            try {
                await getNextQuestion({question: questionList[currentDepth].question, answer: questionList[currentDepth].options[index]}, currentDepth)
                navigate(`/quiz/${chatID}/${currentDepth+1}`);
            } catch (error) {
                setError(true)
            }
        }else if (currentDepth === MAXDEPTH ) {
            try {
                await endChat(chatID, {question: questionList[currentDepth].question, answer: questionList[currentDepth].options[index]})
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md w-full">
            
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {heads[currentDepth]+questionList[currentDepth].question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {questionList[currentDepth].options.map((option, index) => (
                <Button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className=" text-black font-bold py-2 px-4 rounded"
                >
                    {option}
                </Button>
                ))}
            </div>
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