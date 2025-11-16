'use client'

import { useProfile } from "@/contexts/profileContext"
import { Box, TextField, Avatar, Button } from "@mui/material"
import { useState, useEffect } from "react"

import imageCompression from "browser-image-compression"

export default function Home(){
    const { profile, updateProfile } = useProfile()

    const [ fullName, setFullName ] = useState<string>(profile ? profile.full_name ?? "" : "")
    const [ website, setWebsite ] = useState<string>(profile ? profile.website ?? "" : "")
    const [avatar, setAvatar] = useState<File | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState<string>(profile ? profile.avatar_url ?? "" : "")

    function handleAvatar(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0]
        if (!file) return

        const options = {
            maxWidthOrHeight: 256,
            fileType: 'image/webp'
        }

        const controller = new AbortController();

        imageCompression(file, options)
            .then((compressedFile)=>setAvatar(compressedFile))
            .catch((error)=>console.log(error))

        setTimeout(function (){
            controller.abort(new Error('Abort Compression'));
        }, 1500);

    }

    function handleSave(){
        if(profile){
            profile.full_name = fullName
            profile.website = website
            updateProfile(profile, avatar)
        }
    }


    useEffect(()=>{
        if(avatar){
            console.log(avatar)
            const previewUrl = URL.createObjectURL(avatar)
            setAvatarUrl(URL.createObjectURL(avatar))

            return () => URL.revokeObjectURL(previewUrl)
        }

    },[avatar])

    if(!profile) return <></>

    return(
        <Box sx={{display: "grid", gap: 2, maxWitdh: 300}}>
            <Avatar src={avatarUrl} sx={{width:100, height: 100}}/>
            <Button variant="contained" component="label">
                {avatar ? avatar.name : "Upload Avatar"}
                <input type="file" hidden accept="image/*" onChange={handleAvatar} />
            </Button>
            <TextField
                id="email"
                defaultValue={profile.username ?? ""}
                label={"Email"}
                slotProps={{
                    input: {readOnly: true}
                }}
            />
            <TextField
            id="full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                label={"Full Name"}
            />
            <TextField
            id="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                label={"Website"}
            />
            <Button onClick={handleSave} variant="contained">
                Save Profile
            </Button>
        </Box>
    )
}