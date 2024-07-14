import { update, ref ,set as write, serverTimestamp} from "firebase/database";
import { db } from "@/lib/firebase";
import { atom } from "jotai";
import { gender, loading, occasion, priceRange, recipient, answers, gift, question as nextQuestion, name, question } from "@/lib/atoms";
import { Answer, Product, Question } from "@/lib/types";



export const startChat = atom(null,async(get,set,chatID)=>{
    set(loading, true)
    try{
        
        await write(ref(db, `chats/${chatID}`), {
            chatID,
            name: get(name),
            gender: get(gender),
            recipient: get(recipient),
            occasion: get(occasion),
            priceRange: get(priceRange),
            createdAt: serverTimestamp(),
        });

    }catch(error){
        console.log(error);
        throw new Error("Failed to start chat");
    }
    finally{
        set(loading, false)
    }
})
startChat.debugLabel = "startChat";

export const next = atom(null, async (get,set, option: number,currentDepth: number) => {
    const newTag: string = get(question)[currentDepth].tags[option]
    set(answers, prev => {prev[currentDepth] = newTag; return prev})
    console.log("New keyword", newTag);
    
})

const recommend = (gender: string, priceRange: number[], answers: Answer[]) => {
    // let pool: { [key: string]: Product } = { ...product };

    // // If the product pool has product with different gender, filter out the products
    // if (gender == "남성"){
    //     questionData["성별"]?.["여성"].forEach((key: number) => {
    //         delete pool[key.toString()];
    //     })
    // } else {
    //     questionData["성별"]?.["남성"].forEach((key: number) => {
    //         delete pool[key.toString()];
    //     })
    // }
    // console.log("Initial Pool:", pool);
    
    // answers.forEach(answer => {
    //     const matchingProductsKeys: number[] = questionData[answer.question]?.[answer.answer];
    //     if (matchingProductsKeys && matchingProductsKeys.length > 0) {
    //         const filteredPool: { [key: string]: Product } = {};
    //         matchingProductsKeys.forEach((key: number) => {
    //             if (pool[key.toString()]) {
    //                 //If the price of the product is within the price range, add it to the filtered pool
    //                 if (pool[key.toString()].price >= priceRange[0] && pool[key.toString()].price <= priceRange[1])
    //                     filteredPool[key.toString()] = pool[key.toString()];
    //             }
    //         });

    //         // If filtering results in an empty pool but the original pool was not empty, do not apply the filter.
    //         if (Object.keys(filteredPool).length > 0 || Object.keys(pool).length === 0) {
    //             pool = filteredPool;
    //         }
    //     }

    //     console.log("Pool:", pool);
        
    // });



    // return Object.values(pool);
};


export const finishChat = atom(null, async (get,set,chatID, option: number, currentDepth: number) => {
    const newTag = get(question)[currentDepth].tags[option]
    set(answers, prev => {prev[currentDepth] = newTag; return prev})
    set(loading, true)
    
    try {
        await update(
            ref(db, `/chats/${chatID}`),
            { 
                answers: get(answers),
                modifiedAt: serverTimestamp()
            }
        );

        // //get recommendation proudcts
        // const recommendList = recommend(get(gender),get(priceRange),answerList)
        // console.log(recommendList);
        

        // //select random product
        // const recommended = recommendList[Math.floor(Math.random() * recommendList.length)]

        // set(gift, recommended)

        // await update(
        //     ref(db, `/chats/${chatID}`),
        //     { result: recommended }
        // );

    } catch (error) {
        console.log(error);
        throw new Error("Failed to finish chat");
    } finally{
        set(loading, false)
    }
});