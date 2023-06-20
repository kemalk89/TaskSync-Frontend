import { useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useQuery } from "react-query";
import { UserName } from "../user-name/user-name";
import { DropdownOption } from "../dropdown/dropdown";
import { Option } from "react-bootstrap-typeahead/types/types";
import { User } from "@auth0/auth0-react";

interface AutoCompleteAsyncProps {
  id: string;
  apiFn: (searchText: string) => void;
  onChange: (options: DropdownOption | DropdownOption[]) => void;
  isMultiple?: boolean;
  labelKey: string;
}

export const AutoCompleteAsync = ({
  id,
  apiFn,
  onChange,
  isMultiple = false,
  labelKey,
}: AutoCompleteAsyncProps) => {
  const [selectedOptions, setSelectedOptions] = useState<DropdownOption[]>([]);
  const [searchText, setSearchText] = useState("");
  const searchUsers: any = useQuery({
    queryKey: ["searchUsers", searchText],
    queryFn: () => apiFn(searchText),
    enabled: searchText.length > 0,
  });

  const filterBy = (option: Option) => {
    if (typeof option === 'object') {
      const typed = option as DropdownOption;
      const found = selectedOptions.some(o => o.id === typed.id);

      return !found;
    }

    return false;
  };

  const handleChange = (options: Option[]) => {
    setSelectedOptions(options as DropdownOption[]);
    if (isMultiple) {
      onChange(options as DropdownOption[]);
    } else {
      onChange(options[0] as DropdownOption);
    }
  };

  return (
    <AsyncTypeahead
      labelKey={labelKey}
      filterBy={filterBy}
      id={id}
      multiple={isMultiple}
      isLoading={searchUsers.isLoading}
      onSearch={(query) => setSearchText(query)}
      onChange={handleChange}
      options={searchUsers.data}
      renderMenuItemChildren={(item) => {
        return <UserName user={item as User} />;
      }}
    />
  );
};
