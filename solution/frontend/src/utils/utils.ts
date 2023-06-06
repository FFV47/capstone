import React from "react";

export type StateHookType<T> = React.Dispatch<React.SetStateAction<T>>;

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
