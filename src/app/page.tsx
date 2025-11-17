'use client'

import { useProfile } from "@/contexts/profileContext"
import { Box, TextField, Avatar, Button, IconButton, Grid } from "@mui/material"
import { useState, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close'
import imageCompression from "browser-image-compression"
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Home(){

    const { profile, updateProfile } = useProfile()
    const router = useRouter()
    const supabase = createClient()

    const [ fullName, setFullName ] = useState<string>(profile ? profile.full_name ?? "" : "")
    const [ website, setWebsite ] = useState<string>(profile ? profile.website ?? "" : "")
    const [avatar, setAvatar] = useState<File | undefined>(undefined);
    const [avatarUrl, setAvatarUrl] = useState<string>(profile ? profile.avatar_url ?? "" : "")
    const [avatars, setAvatars] = useState<string[]>([])

    async function handleLogout() {
      await supabase.auth.signOut()
      router.push('/login')
  }

    function handleAvatar(e: React.ChangeEvent<HTMLInputElement>){
        const file = e.target.files?.[0]
        if (!file) return

        const options = {
            maxWidthOrHeight: 256,
            fileType: 'image/webp'
        }

        const controller = new AbortController();

        imageCompression(file, options)
            .then((compressedFile)=>{
                setAvatar(compressedFile)
                const previewUrl = URL.createObjectURL(compressedFile)
                setAvatarUrl(previewUrl)
                setAvatars([...avatars, previewUrl])
            })
            .catch((error)=>console.log(error))

        setTimeout(function (){
            controller.abort(new Error('Abort Compression'));
        }, 1500);

    }

    function handleRemoveAvatar(urlToRemove: string) {
      const newAvatars = avatars.filter(url => url !== urlToRemove)
      setAvatars(newAvatars)
      
      if (urlToRemove === avatarUrl && newAvatars.length > 0) {
          setAvatarUrl(newAvatars[0])
      }
      
      URL.revokeObjectURL(urlToRemove)
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


            {avatars.length > 0 && (
                <Grid container spacing={2}>
                    {avatars.map((url, index) => (
                        <Grid key={index}>
                            <Box 
                                sx={{
                                    position: 'relative',
                                    cursor: 'pointer',
                                    border: url === avatarUrl ? '3px solid #1976d2' : '3px solid transparent',
                                    borderRadius: 1
                                }}
                                onClick={() => setAvatarUrl(url)}
                            >
                                <Box
                                    component="img"
                                    src={url}
                                    sx={{width: 80, height: 80, objectFit: 'cover'}}
                                />
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        backgroundColor: 'red',
                                        color: 'white',
                                        width: 24,
                                        height: 24,
                                        '&:hover': {
                                            backgroundColor: 'darkred'
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveAvatar(url)
                                    }}
                                >
                                    <CloseIcon sx={{fontSize: 16}} />
                                </IconButton>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}

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
            <Button onClick={handleLogout} variant="outlined">
                Log Out
            </Button>
        </Box>
    )
}