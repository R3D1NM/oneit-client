import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';

const NotFound = () => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRendered(true);
        }, 500); // Delay of 5 seconds

        return () => clearTimeout(timer); // Clean up on component unmount
    }, []);

    if (!isRendered) {
        // return <Spinner/>; // or return a loading spinner, etc.
        return null;
    }

    return (
        <div className="w-full max-h-[75%] px-2 pt-4">
            <div className="flex flex-col items-center gap-4 text-center">
                <TriangleAlertIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-4xl text-oneit-pink">
                    Page Not Found
                </h1>
                <span className="max-w-[90%] text-gray-500 md:text-lg dark:text-gray-400">
                    URL을 확인하고 다시 시도해주세요
                </span>
                <a href="/main">
                    <Button>메인으로</Button>
                </a>
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TriangleAlertIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    );
}

export default NotFound;
