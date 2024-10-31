import React from 'react';

import {ReactNode} from 'react';
import {sendErrorToSlack} from './lib/slack';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {
        sendErrorToSlack({message: error.message, errorPoint: 'ErrorBoundary'});
        return {hasError: true};
    }

    render() {
        if (this.state.hasError) {
            // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
            return (
                <div className="flex flex-col w-full text-center justify-center items-center h-full">
                    <h1 className="text-lg">알 수 없는 오류가 발생했어요 :(</h1>
                    <a href={`${import.meta.env.VITE_CURRENT_DOMAIN}/main`}>
                        <span className="text-blue-600 underline">
                            메인으로 돌아가기
                        </span>
                    </a>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
