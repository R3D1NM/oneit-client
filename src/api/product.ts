import { gift, isValidGift, name, recipient } from "@/lib/atoms";
import { db } from "@/lib/firebase";
import { ref , get as read, child} from "firebase/database";
import { atom } from "jotai";

export const getGift = atom(null, async (get,set,chatID) => {
    const dbRef = ref(db);
    read(child(dbRef, `/chats/${chatID}`))
    .then(snapshot => {
    if (snapshot.exists()) {
        const data = snapshot.val();
        set(gift, data.result)
        set(recipient, data.recipient)
        set(name, data.name)
        set(isValidGift, true)
    } else {
        console.log("No data available");
        set(isValidGift, false)
    }
    })
        .catch(error => {
        console.error(error);
        set(isValidGift, false)
    });
})
getGift.debugLabel = "getGift";