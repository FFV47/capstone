import axios from "axios";
import React from "react";

export type TStateHook<T> = React.Dispatch<React.SetStateAction<T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TLoaderData<T extends (...args: any) => any> = Awaited<ReturnType<ReturnType<T>>>;

export const sleep = (sec: number) => new Promise((resolve) => setTimeout(resolve, sec * 1000));

export function handleAxiosError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    // console.log(error.config);
  }
}
