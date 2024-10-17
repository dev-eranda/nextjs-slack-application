import { cn } from "@/lib/utils";
import { ImageIcon, Smile, XIcon } from "lucide-react";
import Image from "next/image";
import Quill, { type QuillOptions } from "quill";
import { Delta, Op } from "quill/core";
import "quill/dist/quill.snow.css";
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import { EmojiPopover } from "./emoji-popover";
import { Hint } from "./hint";
import { Button } from "./ui/button";

type EditorValue = {
   image: File | null;
   body: string;
};

interface EditorProps {
   onSubmit: ({ image, body }: EditorValue) => void;
   onCancel?: () => void;
   placeholder?: string;
   defaultValue?: Delta | Op[];
   disabled?: boolean;
   innerRef?: MutableRefObject<Quill | null>;
   variant?: "create" | "update";
}

const Editor = ({
   onSubmit,
   onCancel,
   placeholder = "Write something...",
   defaultValue = [],
   disabled = false,
   innerRef,
   variant = "create",
}: EditorProps) => {
   const [text, setText] = useState("");
   const [isToolbarVisible, setIsToolbarVisible] = useState(true);
   const [image, setImage] = useState<File | null>(null);

   const submitRef = useRef(onSubmit);
   const placeholderRef = useRef(placeholder);
   const quillRef = useRef<Quill | null>(null);
   const defaultValueRef = useRef(defaultValue);
   const containerRef = useRef<HTMLDivElement>(null);
   const disabledRef = useRef(disabled);
   const imageElementRef = useRef<HTMLInputElement>(null);

   useLayoutEffect(() => {
      submitRef.current = onSubmit;
      placeholderRef.current = placeholder;
      defaultValueRef.current = defaultValue;
      disabledRef.current = disabled;
   });

   useEffect(() => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const editorContainier = container.appendChild(container.ownerDocument.createElement("div"));

      const options: QuillOptions = {
         theme: "snow",
         placeholder: placeholderRef.current,
         modules: {
            keyboard: {
               bindings: {
                  enter: {
                     key: "Enter",
                     handler: () => {
                        const text = quill.getText();
                        const addedImage = imageElementRef.current?.files?.[0] || null;

                        const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
                        if (isEmpty) return;

                        const body = JSON.stringify(quill.getContents());
                        submitRef.current?.({ body, image: addedImage });
                     },
                  },
                  shift_enter: {
                     key: "Enter",
                     shiftKey: true,
                     handler: () => {
                        const selection = quill.getSelection()?.index || 0;
                        quill.insertText(selection, "\n");
                     },
                  },
               },
            },
         },
      };

      const quill = new Quill(editorContainier, options);
      quillRef.current = quill;

      // focus edior
      quillRef.current.focus();

      if (innerRef) {
         innerRef.current = quill;
      }

      quill.setContents(defaultValueRef.current);
      setText(quill.getText());

      quill.on(Quill.events.TEXT_CHANGE, () => {
         setText(quill.getText());
      });

      return () => {
         quill.off(Quill.events.TEXT_CHANGE);

         if (container) {
            container.innerHTML = "";
         }
         if (quillRef.current) {
            quillRef.current = null;
         }
         if (innerRef) {
            innerRef.current = null;
         }
      };
   }, [innerRef]);

   const toggleToolbar = () => {
      setIsToolbarVisible((current) => !current);
      const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

      if (toolbarElement) {
         toolbarElement.classList.toggle("hidden");
      }
   };

   const onEmojiSelect = (emoji: any) => {
      const quill = quillRef.current;

      // add emoji to end of the characters, if there is no character index is 0
      quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
   };

   const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

   return (
      <div className="flex flex-col">
         <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files![0])}
            ref={imageElementRef}
            className="hidden"
         />
         <div
            className={cn(
               "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
               disabled && "opacity-50"
            )}>
            <div ref={containerRef} className="h-full ql-custom" />
            {!!image && (
               <div className="p-2">
                  <div className="relative size-[62px] flex items-center justify-center group/image">
                     <Hint label="Remove image">
                        <button
                           onClick={() => {
                              setImage(null);
                              imageElementRef.current!.value = "";
                           }}
                           className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white h-6 w-6 z-[4] border-2 border-white items-center justify-center">
                           <XIcon className="size-3.5" />
                        </button>
                     </Hint>
                     <Image
                        src={URL.createObjectURL(image)}
                        alt="Uploaded"
                        fill
                        className="rounded-md overflow-hidden border object-cover"
                     />
                  </div>
               </div>
            )}

            <div className="flex px-2 pb-2 z-[5]">
               <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>
                  <Button disabled={disabled} size="iconSm" variant="ghost" onClick={toggleToolbar}>
                     <PiTextAa className="size-4" />
                  </Button>
               </Hint>

               {variant === "create" && (
                  <EmojiPopover onEmojiSelect={onEmojiSelect}>
                     <Button disabled={disabled} size="iconSm" variant="ghost">
                        <Smile className="size-4" />
                     </Button>
                  </EmojiPopover>
               )}

               <Hint label="Image">
                  <Button
                     disabled={disabled}
                     size="iconSm"
                     variant="ghost"
                     onClick={() => imageElementRef.current?.click()}>
                     <ImageIcon className="size-4" />
                  </Button>
               </Hint>

               {variant === "update" && (
                  <div className="ml-auto flex items-center gap-x-2">
                     <Button variant="outline" size="sm" onClick={onCancel} disabled={disabled}>
                        Cancel
                     </Button>

                     <Button
                        className="ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                        size="sm"
                        onClick={() => {
                           onSubmit({
                              body: JSON.stringify(quillRef.current?.getContents()),
                              image,
                           });
                        }}
                        disabled={disabled || isEmpty}>
                        Save
                     </Button>
                  </div>
               )}

               {variant === "create" && (
                  <Button
                     disabled={disabled || isEmpty}
                     size="sm"
                     className={cn(
                        "ml-auto",
                        isEmpty
                           ? "bg-white hover:bg-white text-muted-foreground"
                           : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                     )}
                     onClick={() => {
                        onSubmit({
                           body: JSON.stringify(quillRef.current?.getContents()),
                           image,
                        });
                     }}>
                     <MdSend className="size-4" />
                  </Button>
               )}
            </div>
         </div>

         {variant === "create" && (
            <div
               className={cn(
                  "p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                  !isEmpty && "opacity-100"
               )}>
               <p>
                  <strong>Shift + Return</strong> to add new line
               </p>
            </div>
         )}
      </div>
   );
};

export default Editor;
