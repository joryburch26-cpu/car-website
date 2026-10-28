"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

// Tells a page whether the visitor is logged in, and whether they are a seller
export function useSeller() {
  const [state, setState] = useState({ checked: false, isLoggedIn: false, isSeller: false });

  useEffect(() => {
    let active = true;

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      let seller = false;

      if (user) {
        const { data: row } = await supabase
          .from("sellers")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();
        seller = !!row;
      }

      if (active) setState({ checked: true, isLoggedIn: !!user, isSeller: seller });
    }

    check();
    return () => {
      active = false;
    };
  }, []);

  return state;
}
