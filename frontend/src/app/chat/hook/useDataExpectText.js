import { chatApi } from '@/app/api/axios/chatApi'
import React, { useEffect } from 'react'

export default function useDataExpectText(open, text) {
    const [data, setData] = React.useState(null)
    useEffect(() => {
        const fetch = async () => {
            const result = await getExpectTextAsync(text)
            setData(result)
        }
        if (open) {
            fetch()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text])
    return data;
}
async function getExpectTextAsync(text) {
    try {
        const { data } = await chatApi.getExpectText(text);
        return data

    } catch (error) {

        console.error(error)
        return null
    }
}
