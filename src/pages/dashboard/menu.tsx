import React, { FC, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MultiValue } from "react-select";
import { MAX_FILE_SIZE } from "src/constants";
import { api } from "src/utils/api";
import { selectOptions } from "src/utils/helpers";
import { Categories } from "@types";

const DynamicSelect = dynamic(() => import("react-select"), { ssr: false });

type MenuProps = {};

type Input = {
  name: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: undefined | File;
};

const initialInput: Input = {
  name: "",
  price: 0,
  categories: [],
  file: undefined,
};

const Menu: FC<MenuProps> = ({ }: MenuProps) => {
  const [input, setInput] = useState<Input>(initialInput);
  const [preview, setPrevview] = useState<string>("");
  const [error, setError] = useState<string>("");

  // tRPC
  const { mutateAsync: createPresignedUrl } =
    api.admin.createPresignedUrl.useMutation();
  const { mutateAsync: addItem } = api.admin.addMenuItem.useMutation();
  const { data: menuItems, refetch } = api.menu.getMenuItems.useQuery();
  const { mutateAsync: deleteMenuItem } =
    api.admin.deleteMenuItem.useMutation();

  useEffect(() => {
    // create the preview
    if (!input.file) return;

    const objectUrl = URL.createObjectURL(input.file);
    setPrevview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [input.file]);

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(111);

    if (!event.target.files?.[0]) return setError("No file selected");
    if (event.target.files[0].size > MAX_FILE_SIZE)
      return setError("File size is too big");
    setInput((prev) => ({ ...prev, file: event.target.files![0] }));
  }

  async function handleImageUpload() {
    const { file } = input;
    if (!file) return;

    const { fields, key, url } = await createPresignedUrl({
      fileType: file.type,
    });

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    await fetch(url, {
      method: "POST",
      body: formData,
    });

    return key;
  }

  async function addMenuItem() {
    const key = await handleImageUpload();
    if (!key) throw new Error("No key");

    await addItem({
      name: input.name,
      imageKey: key,
      categories: input.categories.map(
        (category) => category.value as Exclude<Categories, "all">
      ),
      price: input.price,
    });

    refetch();

    // Reset input
    setInput(initialInput);
    setPrevview("");
  }

  async function handleDelete(imageKey: string, id: string) {
    await deleteMenuItem({ imageKey, id });
    refetch();
  }

  return (
    <>
      <div>
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <input
            onChange={(event) =>
              setInput((prev) => ({ ...prev, name: event.target.value }))
            }
            value={input.name}
            className="h-12 rounded-sm border-none bg-gray-200"
            name="name"
            placeholder="name"
            type="text"
          />
          <input
            onChange={(event) =>
              setInput((prev) => ({
                ...prev,
                price: Number(event.target.value),
              }))
            }
            value={input.price}
            className="h-12 rounded-sm border-none bg-gray-200"
            name="price"
            placeholder="price"
            type="number"
          />

          <DynamicSelect
            value={input.categories}
            options={selectOptions}
            onChange={(event) =>
              // @ts-ignore
              setInput((prev) => ({ ...prev, categories: event }))
            }
            className="h-12"
            isMulti
            name="categories"
          />
          <label
            htmlFor="file"
            className="relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-violet-600"
          >
            <div className="flex h-full items-center justify-center">
              {preview ? (
                <div>
                  <Image
                    src={preview}
                    alt="preview"
                    style={{ objectFit: "contain" }}
                    fill
                  />
                </div>
              ) : (
                <span>Select image</span>
              )}
            </div>
            <input
              onChange={handleFileSelect}
              name="file"
              id="file"
              type="file"
              accept="image/jpeg image/png image/jpg"
              className="sr-only"
            />
          </label>

          <button
            onClick={addMenuItem}
            disabled={!input.file || !input.name}
            className="h-12 rounded-sm border-none bg-gray-200 disabled:cursor-not-allowed"
          >
            Add menu item
          </button>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="mx-auto mt-12 max-w-7xl">
          <p className="text-lg font-medium">Your menu items:</p>
          <div>
            {menuItems?.map((menuItem) => {
              console.log(menuItem);


              return (
                <div key={menuItem.id}>
                  <p>{menuItem.name}</p>
                  <div className="relative h-40 w-40">
                    <img alt="" src={menuItem.url} />
                  </div>
                  <button
                    onClick={() => handleDelete(menuItem.imageKey, menuItem.id)}
                    className="text-xs text-red-500"
                  >
                    delete
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
