import Basket from './components/BasketCard';
import Recommend from './components/RecommendCard';

const Main = () => {
	return (
		<div className="flex flex-col overflow-hidden justify-center gap-5 p-1 w-full items-center">
			<Basket />
			<Recommend />
		</div>
	);
};

export default Main;
