'use client'

import { useProfile } from "@/contexts/profileContext"
import { Box, TextField, Avatar, Button } from "@mui/material"
import { useState, useEffect } from "react"

export default function Home(){
    const { profile } = useProfile()

    if(!profile) return <></>


    const [ fullName, setFullName ] = useState<string>(profile.full_name ?? "")
    const [ website, setWebsite ] = useState<string>(profile.website ?? "")
    const [avatar, setAvatar] = useState<File | undefined>(undefined);

    useEffect(()=>{
        if(avatar){
            console.log(avatar)
        }
    },[avatar])

    return(
        <Box sx={{display: "grid",gap: 2, maxWitdh: 300,}}>
            <Avatar src={profile.avatar_url ?? ""} sx={{width:100, height: 100}}/>
            <Button variant="contained" component="label">
                {avatar ? avatar.name : "Upload Avatar"}
                <input type="file" hidden accept="image/*" onChange={(e => setAvatar(e.target.files?.[0]))} />
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
        </Box>
    )
}