/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { useRouter } from "next/router";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { dateToString } from "src/lib/day";
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
  const router = useRouter();

  // ログアウト済みの場合はログインページにリダイレクト
  if (!isLogin) {
    router.push("/");
  }

  // リアルタイムデータ更新
  const fetchRealtimeData = () => {
    try {
      supabase
        .channel("table_postgres_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: TABLE_NAME,
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
      setMessageText(allMessage as Database[]);
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
    addSupabaseData({ message: inputText, ...profileFromGithub });
    setInputText("");
  };

  return (
    <div className="mx-auto my-8 max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-cyan-6 bg-cyan-1 p-8">
      <div className="flex justify-between border-b-2 border-cyan-6 py-3">
        <span className="mr-3 text-2xl text-cyan-12">オープンチャット</span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-3xl text-pink-11 transition duration-500 ease-in-out hover:bg-pink-3 focus:outline-none active:bg-pink-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-3xl text-yellow-11 transition duration-500 ease-in-out hover:bg-yellow-3 focus:outline-none active:bg-yellow-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div
        id="messages"
        className="flex flex-col space-y-4 overflow-y-auto p-3"
      >
        {messageText.map((item) => {
          return (
            <div
              key={item.id}
              data-my-chat={item.nickName === profileFromGithub.nickName}
              className="flex items-end justify-end"
            >
              <div className="mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
                <span className="inline-block rounded-lg rounded-br-none bg-cyan-6 px-4 py-2 text-cyan-12 ">
                  {item.message}
                </span>
              </div>
              <div>
                <time>{dateToString(item.createdAt, "MM/DD HH:mm")}</time>
                <a
                  href={`https://github.com/${item.nickName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt="アイコン"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/noimage.png"
                      alt="no image"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                  )}
                  <p>{item.nickName ? item.nickName : "名無し"}</p>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={onSubmitNewMessage}
        className="mb-2 border-t-2 border-cyan-6 px-4 pt-4 sm:mb-0"
      >
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full text-cyan-11 transition duration-500 ease-in-out hover:bg-cyan-3 focus:outline-none active:bg-cyan-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-cyan-11"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                ></path>
              </svg>
            </button>
          </span>
          <input
            type="text"
            name="message"
            value={inputText}
            onChange={onChangeInputText}
            aria-label="新規メッセージを入力"
            placeholder="Write your message!"
            className="w-full rounded-lg border-none bg-cyan-2 py-3 pl-12 placeholder:text-gray-12 focus:outline-none focus:ring-0 focus:placeholder:text-gray-11"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-cyan-11 transition duration-500 ease-in-out hover:bg-cyan-3 focus:outline-none active:bg-cyan-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-cyan-11"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              type="submit"
              disabled={inputText === ""}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-9 px-4 py-3 text-cyan-1 transition duration-500 ease-in-out hover:bg-cyan-10 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="ml-2 h-6 w-6 rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
