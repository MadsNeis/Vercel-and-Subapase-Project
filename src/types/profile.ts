export type Profile = {
    id: string,
    username: string | null,
    full_name: string | null,
    avatar_url: string | null,
    website: string | null
}

export const profileSelectString= "id, username, full_name, avatar_url, website"