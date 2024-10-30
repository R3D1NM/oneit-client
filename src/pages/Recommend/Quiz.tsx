import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {loading, name, question, recipient} from '@/atoms/recommend';
import {useNavigate, useParams} from 'react-router-dom';
import {Spinner} from '@/components/ui/spinner';
import {useState, useEffect} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogHeader,
} from '@/components/ui/dialog';
import {Button} from '@/components/common/Button';
import {finishRecommend, next} from '@/api/chat';
import {parse} from 'cox-postposition';
import Header from '@/components/common/Header';
import React from 'react';

const MAXDEPTH = 8;

const Quiz = () => {
    const isloading = useAtomValue(loading);
    const setAnswers = useSetAtom(next);
    const questionList = useAtomValue(question);
    const userRecipient = useAtomValue(recipient);
    const userName = useAtomValue(name);

    const navigate = useNavigate();
    const params = useParams();
    const chatID = params.chatID || '';
    const currentDepth = Number(params.currentDepth);

    const [error, setError] = useState(false);
    const [selected, setSelected] = useState(-1);
    const [optionSizes, setOptionSizes] = useState<string[]>([]);

    const [{mutate, mutateAsync}] = useAtom(finishRecommend);

    const handlNext = async (index: number) => {
        if (currentDepth < MAXDEPTH - 1) {
            await setAnswers(index, currentDepth);
            setSelected(-1);
            navigate(`/recommend/${chatID}/${currentDepth + 1}`);
        } else if (currentDepth === MAXDEPTH - 1) {
            await setAnswers(index, currentDepth);
            mutateAsync({chatID});
            navigate(`/recommend/${chatID}/result`, {replace: true});
        } else {
            setError(true);
        }
    };

    useEffect(() => {
        const sizes = questionList[currentDepth].options.map((option) => {
            const lines = option.split('\n');
            const maxLineLength = Math.max(...lines.map((line) => line.length));

            if (maxLineLength <= 8) return 'text-base';
            if (maxLineLength <= 12) return 'text-sm';
            if (maxLineLength <= 16) return 'text-xs';
            return 'text-[12px]'; // For very long lines
        });
        setOptionSizes(sizes);
    }, [currentDepth, questionList]);

    if (isloading) {
        return <Spinner />;
    }

    return (
        <>
            <Header variant="back" />
            <main className="pt-14 px-4" role="main">
                <div className="">
                    <div className="mt-2.5">
                        <p className="text-sm">
                            선물하고 싶은 분의 정보를 알려주세요.
                        </p>
                        <p className="text-2xl font-bold">
                            딱 맞는 선물을 추천해드릴게요 !
                        </p>
                    </div>
                    <div className="range_bar flex items-center gap-3.5 mt-4.5">
                        <ol className="questions quesions_medium list-none m-0 p-0 table table-fixed w-[calc(100%-37px)] text-[#849397]">
                            {[...Array(MAXDEPTH)].map((_, index) => (
                                <li
                                    key={index}
                                    data-step={index + 1}
                                    className={`relative table-cell text-center text-xs
                                        ${index < currentDepth ? 'text-[#ff4bc1]' : ''}
                                        ${index === currentDepth ? 'text-[#3498db]' : ''}
                                    `}
                                >
                                    <div
                                        className={`absolute w-full h-0.5 top-0 left-0 z-0
                                        ${index < currentDepth ? 'bg-[#ff4bc1]' : 'bg-[#e7e7e7]'}
                                    `}
                                    ></div>
                                </li>
                            ))}
                        </ol>
                        <div className="text text-sm text-[#5d5d5d]">
                            <em>{currentDepth + 1}</em>/{MAXDEPTH}
                        </div>
                    </div>
                    <div className="relation_insert flex flex-col items-center">
                        <p className="stitle text-sm text-[#5d5d5d] text-center mt-[4.125rem] mb-6">
                            {questionList[currentDepth].question
                                .replace(
                                    /000/g,
                                    userName === '' ? userRecipient : userName,
                                )
                                .split('\n')
                                .map((line, index, array) => (
                                    <span key={index}>
                                        {parse(line)}
                                        {index < array.length - 1 && <br />}
                                    </span>
                                ))}
                        </p>

                        <div className="select flex flex-col w-60">
                            {questionList[currentDepth].options.map(
                                (option, index) => (
                                    <div key={index} className="mb-4">
                                        <input
                                            type="radio"
                                            id={`select${index + 1}`}
                                            name="relation"
                                            checked={selected === index}
                                            onChange={() => {
                                                setSelected(index);
                                                handlNext(index);
                                            }}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`select${index + 1}`}
                                            className={`w-full py-2 px-4 text-center border rounded-full cursor-pointer overflow-hidden whitespace-pre-wrap break-words min-h-[2.5rem] flex items-center justify-center
                                        ${
                                            selected === index
                                                ? 'border-[#ff4bc1] text-[#ff4bc1]'
                                                : 'border-[#b1b1b1] text-[#3d3d3d]'
                                        }
                                        ${optionSizes[index]}
                                    `}
                                        >
                                            {option
                                                .split('\n')
                                                .map(
                                                    (
                                                        line,
                                                        lineIndex,
                                                        array,
                                                    ) => (
                                                        <React.Fragment
                                                            key={lineIndex}
                                                        >
                                                            {line}
                                                            {lineIndex <
                                                                array.length -
                                                                    1 && <br />}
                                                        </React.Fragment>
                                                    ),
                                                )}
                                        </label>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </main>
            {/* <div className="bottom fixed bottom-0 left-0 right-0 p-4">
                <div className="btn_wrap">
                    <Button
                        onClick={() => handlNext(selected)}
                        disabled={selected === undefined}
                        className="w-full py-2 px-4 rounded-full bg-[#ff4bc1] text-white disabled:bg-[#b0b0b0]"
                    >
                        {currentDepth === MAXDEPTH - 1
                            ? '추천 선물 보러 가기'
                            : '다음'}
                    </Button>
                </div>
            </div> */}

            {/* Keep the existing error Dialog */}
            {error && (
                <Dialog open={error} onOpenChange={setError}>
                    <DialogContent
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e: {
                            preventDefault: () => void;
                        }) => {
                            e.preventDefault();
                        }}
                    >
                        <DialogHeader>
                            <DialogTitle>문제 발생</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            문제가 발생했습니다. 다시 시도해주세요.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="disabled"
                                onClick={() => {
                                    setError(false);
                                    navigate('/main');
                                }}
                            >
                                메인으로
                            </Button>
                            <Button
                                type="submit"
                                onClick={() => {
                                    setError(false);
                                    handlNext(selected);
                                }}
                            >
                                다시시도
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default Quiz;
