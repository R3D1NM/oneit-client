import {useRef, useEffect} from 'react';
import Lottie from 'lottie-web';

type LottieContainerProps = {
	fileName: string;
};

export const LottieContainer = ({
	fileName,
	...rest
}: LottieContainerProps & React.HTMLAttributes<HTMLSpanElement>) => {
	const lottieContainer = useRef<HTMLDivElement>(null);

	const getAnimationPath = () => {
		const basePath =
			import.meta.env.MODE === 'development' ? '/src/assets/' : `/`;
		return `${basePath}${fileName}`;
	};

	// Lottie 애니메이션 로드 및 초기화
	useEffect(() => {
		Lottie.loadAnimation({
			container: lottieContainer.current!,
			renderer: 'svg',
			loop: true,
			autoplay: true,
			path: getAnimationPath(),
		});

		return () => Lottie.destroy();
	}, [fileName]);

	return <div className="w-full h-full" ref={lottieContainer} {...rest} />;
};

export default LottieContainer;
