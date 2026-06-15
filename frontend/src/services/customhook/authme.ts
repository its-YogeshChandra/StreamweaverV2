import {useAuth, useUser} from "@clerk/nextjs"

//get the value of the user from the clerk db 
interface AuthmeResult{
    isAuth: boolean,
    isLoaded: boolean,
    userId: string | null | undefined,
}


export default function authme():AuthmeResult{
    const {userId} = useAuth()
    const {user, isLoaded} = useUser()

    const res: AuthmeResult ={
        isAuth: !!userId,
        isLoaded,
        userId
    }

    return res;
}