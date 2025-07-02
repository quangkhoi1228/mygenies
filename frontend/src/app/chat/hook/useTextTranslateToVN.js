import { chatApi } from "@/app/api/axios/chatApi";
import { useState, useEffect } from "react";

export default function useTextTranslateToVN(showTranslate, text) {
    const [textTranslate, setTextTranslate] = useState(undefined)
    useEffect(() => {
        const fetch = async () => {
            if (text) {
                const response = await getTextTranslateToVn(text)
                setTextTranslate(response.translatedText)
            }
        }
        if (showTranslate) {
            fetch()
        }

    }, [showTranslate, text])
    return textTranslate;
}

async function getTextTranslateToVn(text) {
    try {
        const { data } = await chatApi.getTextTranslateToVN(text)
        return data
    } catch (error) {
        return null
    }
}