import Basket from "@/components/Cards/BasketCard"
import Recommend from "@/components/Cards/RecommendCard"

const Main = () => {



    return(
        <div className="flex flex-col overflow-hidden justify-center gap-5 p-1 w-full items-center">
            <Recommend/>
            <Basket/>
        </div>
    )
}

export default Main