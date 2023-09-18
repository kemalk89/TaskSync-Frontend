import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingToolbarPlugin } from "./heading-toolbar-plugin";
import { TextFormatPlugin } from "./text-format-plugin";
import { ListToolbarPlugin } from "./list-toolbar-plugin";
import { ButtonGroup } from "reactstrap";

export const ToolbarPlugin = () => {
  return (
    <ButtonGroup className="uic-texteditor-toolbar">
      <HeadingToolbarPlugin />
      <TextFormatPlugin />
      <ListToolbarPlugin />
      <ListPlugin />
    </ButtonGroup>
  );
};
