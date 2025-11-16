import { createClient } from "@/utils/supabase/server"

import { put, list, del } from "@vercel/blob"

export async function POST(request: Request){
    const supabase = await createClient()

    const user = await supabase.auth.getUser()

    if(!user || !user.data.user){
        return Response.json({message: "Must be logged in"})
    }

    const formData = await request.formData()
    const image = formData.get('image') as Blob
    const id = formData.get('id')

    if(id !== user.data.user.id){
        return Response.json({message: "Invalid User ID"})
    }

    const userFolder = `${user.data.user.id}/`

    const existingFiles = await list({prefix: userFolder})
    console.log(existingFiles)

    for(let i = 0; i < existingFiles.blobs.length; i++){
        del(existingFiles.blobs[i].pathname)
    }

    


    const filename = `${userFolder}avatar-${Date.now()}.webp`
    
    const { url } = await put(filename, image, {access: 'public', allowOverwrite: true})
    return Response.json({avatarUrl: url})


}