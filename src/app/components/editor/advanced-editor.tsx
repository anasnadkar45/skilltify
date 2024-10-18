"use client";
import React, { useState } from "react";
import {
  EditorRoot,
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  type JSONContent,
  EditorCommandList,
  EditorBubble,
  EditorContent,
} from "novel";
import { ImageResizer, handleCommandNavigation } from "novel/extensions";

import { handleImageDrop, handleImagePaste } from "novel/plugins";

import { slashCommand, suggestionItems } from "./slash-command";
import { NodeSelector } from "./selectors/node-selector";
import { LinkSelector } from "./selectors/link-selector";
import { TextButtons } from "./selectors/text-buttons";
import { ColorSelector } from "./selectors/color-selector";
import { Separator } from "@/components/ui/separator";
import { defaultExtensions } from "./extensions";
import { uploadFn } from "./image-upload";
import GlobalDragHandle from "tiptap-extension-global-drag-handle";
import AutoJoiner from "tiptap-extension-auto-joiner";

const dragExtension = [
  GlobalDragHandle.configure({
      dragHandleWidth: 20,    // default

      // The scrollTreshold specifies how close the user must drag an element to the edge of the lower/upper screen for automatic 
      // scrolling to take place. For example, scrollTreshold = 100 means that scrolling starts automatically when the user drags an 
      // element to a position that is max. 99px away from the edge of the screen
      // You can set this to 0 to prevent auto scrolling caused by this extension
      scrollTreshold: 100     // default
  }),
  AutoJoiner.configure({
      elementsToJoin: ["bulletList", "orderedList"] // default
  }),
  // other extensions
];

const extensions = [...defaultExtensions, slashCommand, ...dragExtension];

interface EditorProp {
  initialValue?: string;
  onChange: (value: string) => void;
}
const Editor = ({ initialValue, onChange }: EditorProp) => {
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  return (
    <EditorRoot>
      <EditorContent
        className="p-10 rounded-xl"
        {...(initialValue && { initialContent: initialValue })}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) =>
            handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full h-[calc(100vh-6.7rem)]`,
          },
        }}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML());
        }}
        slotAfter={<ImageResizer />}
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
                key={item.title}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>

        <EditorBubble
          tippyOptions={{
            placement: "top",
          }}
          className="flex w-fit max-w-[85vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl"
        >
          <Separator orientation="vertical" />
          <NodeSelector open={openNode} onOpenChange={setOpenNode} />
          <Separator orientation="vertical" />

          <LinkSelector open={openLink} onOpenChange={setOpenLink} />
          <Separator orientation="vertical" />
          <TextButtons />
          <Separator orientation="vertical" />
          <ColorSelector open={openColor} onOpenChange={setOpenColor} />
        </EditorBubble>
      </EditorContent>
    </EditorRoot>
  );
};

export default Editor;