import { format } from "date-fns";

export const formatDateTime = (dateTimeString: string) => {
    return format(new Date(dateTimeString), "PPPpp");
}