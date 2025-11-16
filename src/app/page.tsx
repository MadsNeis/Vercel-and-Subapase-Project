'use client'

import { useProfile } from "@/contexts/profileContext";

export default function Home() {
  const { profile } =useProfile()


  return (
  <div>
    {
      profile ? `Hello, ${profile.full_name}` : `Hello World`
    }
  </div>
  );
}
