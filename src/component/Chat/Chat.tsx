import Image from "next/image";
// import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import type { Database } from "src/lib/supabase";
import { supabase } from "src/lib/supabase";
import {
  addSupabaseData,
  fetchDatabase,
  TABLE_NAME,
} from "src/lib/supabaseFunctions";
import { useAuth } from "src/lib/user";

/** @package */
export const Chat: FC = () => {
  const [inputText, setInputText] = useState(""); // 入力テキスト
  const [messageText, setMessageText] = useState<Database[]>([]); // メッセージ
  const { profileFromGithub, session: isLogin } = useAuth();
  // const router = useRouter();

  // ログアウト済みの場合はログインページにリダイレクト
  // if (!isLogin) {
  //   router.push("/");
  // }

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
    try {
      supabase
        .channel("table_postgres_changes") // 任意のチャンネル名
        .on(
          "postgres_changes", // ここは固定
          {
            event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
            schema: "public",
            table: TABLE_NAME, // DBのテーブル名
          },
          (payload) => {
            // データ登録
            if (payload.eventType === "INSERT") {
              const { avatarUrl, createdAt, id, message, nickName } =
                payload.new;
              setMessageText((messageText) => {
                return [
                  ...messageText,
                  { createdAt, id, message, avatarUrl, nickName },
                ];
              });
            }
          }
        )
        .subscribe();

      // リスナーの解除
      return () => {
        return supabase.channel("table_postgres_changes").unsubscribe();
      };
    } catch (error) {
      console.error(error);
    }
  };

  // 初回のみ全データフェッチとリアルタイムリスナー登録
  useEffect(() => {
    (async () => {
      const allMessage = await fetchDatabase();
      setMessageText(allMessage as Database[]); // '{ [x: string]: any; }[] | null'
    })();
    fetchRealtimeData();
  }, []);

  // 入力したメッセージ
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) => {
    return setInputText(() => {
      return event.target.value;
    });
  };

  // メッセージの送信
  const onSubmitNewMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputText === "") {
      return;
    }
    addSupabaseData({ message: inputText, ...profileFromGithub }); // DBに追加
    setInputText("");
  };

  return (
    <div>
      {messageText?.map((item) => {
        return (
          <div key={item.id} data-user-id={item.nickName}>
            <div>
              <a
                href={`https://github.com/${item.nickName}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.avatarUrl}
                    alt="アイコン"
                    width={80}
                    height={80}
                  />
                ) : (
                  <Image
                    src="/noimage.png"
                    alt="no image"
                    width={80}
                    height={80}
                  />
                )}
                <p>{item.nickName ? item.nickName : "名無し"}</p>
              </a>
              <p>{item.createdAt}</p>
            </div>
            <p>{item.message}</p>
          </div>
        );
      })}

      {isLogin ? (
        <form onSubmit={onSubmitNewMessage}>
          <input
            type="text"
            name="message"
            value={inputText}
            onChange={onChangeInputText}
            aria-label="新規メッセージを入力"
          />
          <button type="submit" disabled={inputText === ""}>
            送信
          </button>
        </form>
      ) : null}
    </div>
  );
};
