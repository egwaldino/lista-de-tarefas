import { Badge } from "@/components/ui/badge";
import { Check, CircleSlash, List } from "lucide-react";

export type FilterType = "all" | "pending" | "completed";

type FilterProps = {
  currentFilter: FilterType;
  setCurrentFilter: React.Dispatch<React.SetStateAction<FilterType>>;
};

export const Filter = ({ currentFilter, setCurrentFilter }: FilterProps) => {

  return (
    <div className="flex gap-2">
      <Badge
        className="cursor-pointer py-3"
        variant={`${currentFilter === "all" ? "default" : "outline"}`}
        onClick={() => setCurrentFilter("all")}
      >
        <List />
        Todas
      </Badge>
      <Badge
        className="cursor-pointer py-3"
        variant={`${currentFilter === "pending" ? "default" : "outline"}`}
        onClick={() => setCurrentFilter("pending")}
      >
        <CircleSlash />
        Não finalizadas
      </Badge>
      <Badge
        className="cursor-pointer py-3"
        variant={`${currentFilter === "completed" ? "default" : "outline"}`}
        onClick={() => setCurrentFilter("completed")}
      >
        <Check />
        Finalizadas
      </Badge>
    </div>
  );
};
