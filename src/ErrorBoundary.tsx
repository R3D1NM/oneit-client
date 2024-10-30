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
                <p>
                    <h1>Something went wrong.</h1>
                    <a href={`${import.meta.env.VITE_CURRENT_DOMAIN}`}>
                        <span className="text-blue-600 underline">
                            Back to main
                        </span>
                    </a>
                </p>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
