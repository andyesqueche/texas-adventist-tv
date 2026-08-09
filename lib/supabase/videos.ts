import { supabase } from "./client";

export async function getVideos() {

    const { data, error } = await supabase

        .from("videos")

        .select("*")

        .order("display_order");

    if (error) throw error;

    return data;

}