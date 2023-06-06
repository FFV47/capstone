import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import ptBR from "date-fns/locale/pt-BR/index.js";

const date = "2023-05-04T12:31:00.000Z";
const utcDate = utcToZonedTime(date);
const now = new Date().toISOString();
const utcNow = utcToZonedTime(now);

const printDate = format(new Date(date), "PPPPp", { locale: ptBR });
const printDateUTC = format(new Date(utcDate), "PPPPp", { locale: ptBR });
const printNow = format(new Date(now), "PPPPp", { locale: ptBR });
const printNowUTC = format(new Date(utcNow), "PPPPp", { locale: ptBR });

console.log({ printDate, printDateUTC, printNow, printNowUTC });
