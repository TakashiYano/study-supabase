import type { Database } from "src/lib/supabase";
import { supabase } from "src/lib/supabase";

// テーブル名
/** @package */
export const TABLE_NAME = "chat";

// データの全取得
/** @package */
export const fetchDatabase = async () => {
  try {
    const { data } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("createdAt");
    return data;
  } catch (error) {
    console.error(error);
  }
};

type InsertProps = Pick<Database, "message" | "nickName" | "avatarUrl">;

// データの追加
/** @package */
export const addSupabaseData = async ({
  avatarUrl,
  message,
  nickName,
}: InsertProps) => {
  try {
    await supabase.from(TABLE_NAME).insert({ message, avatarUrl, nickName });
  } catch (error) {
    console.error(error);
  }
};
