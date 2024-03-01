"use client";

import supabaseClient from "@/components/supabase/client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";


export default function Home() {
  const supabase = supabaseClient();
  const [user, setUser] = useState("");
  useEffect(() => {
    const fetchAuth = async () => {
      const auth = await supabase.auth.getSession();
      if (auth.data.session === null) {
        window.location.href = "/login";
      }
      setUser(auth.data.session?.user.email!);
      console.log(auth);
    }
    fetchAuth();
  }, []);

  const signOut = async () => {
    const out = await supabase.auth.signOut();
    out.error ? console.log(out.error) : window.location.href = "/login";
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid w-full max-w-sm items-center gap-4">
        <div className="">
          <p>Welcome {user}</p>
        </div>
      </div>
      <Button onClick={() => signOut() }>Sign Out</Button>
    </main>
  );
}
