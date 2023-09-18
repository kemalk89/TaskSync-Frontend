import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { Button } from "reactstrap";
import { IconListOl, IconListUl } from "../..";

type Tags = "ul" | "ol";

export const ListToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const listTags: Tags[] = ["ul", "ol"];
  const handleClick = (tag: Tags) => {
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
    if (tag === "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };
  return (
    <>
      {listTags.map((tag, index) => (
        <Button outline key={index} onClick={() => handleClick(tag)}>
          {tag === "ul" ? <IconListUl /> : <IconListOl />}
        </Button>
      ))}
    </>
  );
};
