import { update, ref ,set as write, serverTimestamp} from "firebase/database";
import { db } from "@/lib/firebase";
import { atom } from "jotai";
import { gender, loading, occasion, priceRange, recipient, answers, gift, question as nextQuestion, name, question } from "@/lib/atoms";
import { Answer, Product, Question } from "@/lib/types";
import axios from '@/lib/axios';


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

interface Payload {
    gender: string;
    age: number;
    minPrice: number;
    maxPrice: number;
    keywords: { [key: string]: string };
}

const recommend = async (payload : Payload) => {
    return new Promise<Product[]>((resolve, reject) => {
        axios.post('/v1/product/result',payload)
        .then((res)=>{
            console.log(res.data);
            
            if(!res.data.isSuccess) throw new Error("Failed to get recommend list")
            console.log(res.data);
            
            resolve(res.data.result)
        })
        .catch((err)=>{
            console.log(err);
            reject(err)
        })
    });

};


export const finishChat = atom(null, async (get,set,chatID: string,option: number, currentDepth: number) => {
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

        const payload = {
            gender: get(gender),
            age: 10,
            minPrice: get(priceRange)[0]>get(priceRange)[1]?get(priceRange)[1]:get(priceRange)[0],
            maxPrice: get(priceRange)[1]>get(priceRange)[0]?get(priceRange)[1]:get(priceRange)[0],
            keywords: get(answers)
        }

        console.log("Payload", payload);
        

        const recommendList = await recommend(payload)

        set(gift, recommendList)

        await update(
            ref(db, `/chats/${chatID}`),
            { result: recommendList }
        );

    } catch (error) {
        console.log(error);
        throw new Error("Failed to finish chat");
    } finally{
        set(loading, false)
    }
});