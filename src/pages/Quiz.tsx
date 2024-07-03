import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { depth, loading, question, recipient } from '@/config/atoms'
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { finishChat, next } from '@/api/chat';

// MAX DEPTH of the chat
const MAXDEPTH = 4

const Quiz = () => {
    const questions = useAtomValue(question)
    const isloading = useAtomValue(loading)
    const [currentQuestion,setCurrentQuestion] = useAtom(depth)
    const getNextQuestion = useSetAtom(next)
    const endChat = useSetAtom(finishChat)
    const userRecipient = useAtomValue(recipient)

    const navigate = useNavigate();
    const { chatID } = useParams()
    const [error, setError] = useState(false)
    const [selected, setSelected] = useState(0)

    const heads = ["",`${userRecipient}의 `,`${userRecipient}이(가) `, `${userRecipient}의 `, `${userRecipient}와(과) `]

    // Debugging logs
    console.log('Questions:', questions, 'Loading:', isloading);

    useEffect(() => {
        //handle browser back button
        window.onpopstate = () => {
            setCurrentQuestion(1)
        }
    }, [])
    
    

    const handleAnswerClick = async (index:number) => {
        setSelected(index)
        const depth = currentQuestion
        console.log('Depth:', depth, 'Selected:', index);
        
        if (depth < MAXDEPTH) {
            try {
                await getNextQuestion({question: questions.question, answer: questions.options[index]})
            } catch (error) {
                setError(true)
            }
        }else if (depth === MAXDEPTH ) {
            try {
                await endChat(chatID, {question: questions.question, answer: questions.options[index]})
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
                {heads[currentQuestion]+questions.question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
                {questions.options.map((option, index) => (
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
                    <Button variant="outline" onClick={() => {setError(false); setCurrentQuestion(1); navigate('/'); } }>
                    메인으로
                    </Button>
                    <Button type="submit" onClick={() => {setError(false); setCurrentQuestion((prev)=>prev-1); handleAnswerClick(selected);} }>
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